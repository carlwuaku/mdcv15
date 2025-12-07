import { Component } from '@angular/core';
import { DataListComponentInterface } from 'src/app/shared/types/DataListComponentInterface';
import { ApiKey } from '../../models/api-key.model';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { ApiManagementService } from '../../apimanagement.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';

@Component({
  selector: 'app-api-keys-list',
  templateUrl: './api-keys-list.component.html',
  styleUrls: ['./api-keys-list.component.scss']
})
export class ApiKeysListComponent implements DataListComponentInterface<ApiKey> {
  baseUrl: string = 'api-integration/api-keys';
  url: string = 'api-integration/api-keys';
  ts: string = '';
  selectedItems: ApiKey[] = [];
  specialClasses: Record<string, string> = {
    'status': 'status-badge'
  };

  getActions = (object: ApiKey): DataActionsButton[] => {
    const actions: DataActionsButton[] = [
      {
        label: 'View Details',
        type: 'link',
        link: 'apimanagement/api-keys/',
        linkProp: 'id'
      },
      {
        label: 'Edit',
        type: 'link',
        link: 'apimanagement/api-keys-form/',
        linkProp: 'id'
      }
    ];

    if (object.status === 'active') {
      actions.push({
        label: 'Revoke',
        type: 'button',
        onClick: (obj: ApiKey) => this.revoke(obj)
      });
      actions.push({
        label: 'Rotate Key',
        type: 'button',
        onClick: (obj: ApiKey) => this.rotate(obj)
      });
    }

    actions.push({
      label: 'Delete',
      type: 'button',
      onClick: (obj: ApiKey) => this.delete(obj)
    });

    return actions;
  };

  constructor(
    private apiManagementService: ApiManagementService,
    private notify: NotifyService
  ) {}

  updateTimestamp(): void {
    this.ts = new Date().getTime().toString();
  }

  setSelectedItems(objects: ApiKey[]): void {
    this.selectedItems = objects;
  }

  revoke(object: ApiKey) {
    const reason = window.prompt('Enter reason for revoking this API key:');
    if (!reason) {
      return;
    }

    this.apiManagementService.revokeApiKey(object.id, reason).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => {
        this.notify.failNotification(error?.error?.message || 'Failed to revoke API key');
      }
    });
  }

  rotate(object: ApiKey) {
    if (!window.confirm(`Are you sure you want to rotate the credentials for "${object.name}"? The old credentials will stop working immediately.`)) {
      return;
    }

    this.apiManagementService.rotateApiKey(object.id).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        if (response.warning) {
          alert(`${response.warning}\n\nNew Key Secret: ${response.data.key_secret}`);
        }
        this.updateTimestamp();
      },
      error: error => {
        this.notify.failNotification(error?.error?.message || 'Failed to rotate API key');
      }
    });
  }

  delete(object: ApiKey) {
    if (!window.confirm(`Are you sure you want to delete API key "${object.name}"?`)) {
      return;
    }

    this.apiManagementService.deleteApiKey(object).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => {
        this.notify.failNotification(error?.error?.message || 'Failed to delete API key');
      }
    });
  }
}
