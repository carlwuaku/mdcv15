import { Component } from '@angular/core';
import { DataListComponentInterface } from 'src/app/shared/types/DataListComponentInterface';
import { Institution } from '../../models/institution.model';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { ApiManagementService } from '../../apimanagement.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';

@Component({
  selector: 'app-institutions-list',
  templateUrl: './institutions-list.component.html',
  styleUrls: ['./institutions-list.component.scss']
})
export class InstitutionsListComponent implements DataListComponentInterface<Institution> {
  baseUrl: string = 'api-integration/institutions';
  url: string = 'api-integration/institutions';
  ts: string = '';
  selectedItems: Institution[] = [];
  specialClasses: Record<string, string> = {
    'status': 'status-badge'
  };

  getActions = (object: Institution): DataActionsButton[] => {
    return [
      {
        label: 'View API Keys',
        type: 'link',
        link: 'apimanagement/api-keys',
        urlParams: { institution_id: object.id }
      },
      {
        label: 'Edit',
        type: 'link',
        link: 'apimanagement/institutions-form/',
        linkProp: 'id'
      },
      {
        label: 'Delete',
        type: 'button',
        onClick: (obj: Institution) => this.delete(obj)
      }
    ];
  };

  constructor(
    private apiManagementService: ApiManagementService,
    private notify: NotifyService
  ) {}

  updateTimestamp(): void {
    this.ts = new Date().getTime().toString();
  }

  setSelectedItems(objects: Institution[]): void {
    this.selectedItems = objects;
  }

  delete(object: Institution) {
    if (!window.confirm(`Are you sure you want to delete institution "${object.name}"?`)) {
      return;
    }

    this.apiManagementService.deleteInstitution(object).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => {
        this.notify.failNotification(error?.error?.message || 'Failed to delete institution');
      }
    });
  }
}
