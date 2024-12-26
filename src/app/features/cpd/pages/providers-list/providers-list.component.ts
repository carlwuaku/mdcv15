import { Component } from '@angular/core';
import { DataListComponentInterface } from 'src/app/shared/types/DataListComponentInterface';
import { CpdProviderObject } from '../../models/cpd_facility_model';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { CpdService } from '../../cpd.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';

@Component({
  selector: 'app-providers-list',
  templateUrl: './providers-list.component.html',
  styleUrls: ['./providers-list.component.scss']
})
export class ProvidersListComponent implements DataListComponentInterface<CpdProviderObject> {

  baseUrl: string = `cpd/providers`;
  url: string = `cpd/providers`;
  ts: string = "";
  selectedItems: CpdProviderObject[] = [];
  getActions = (object: CpdProviderObject): DataActionsButton[] => {
    const actions: DataActionsButton[] = [
      { label: "View", type: "link", link: `cpd/provider/`, linkProp: 'uuid' },
      { label: "Edit", type: "link", link: `cpd/providers-form`, linkProp: 'uuid' },
      { label: "Delete", type: "button", onClick: (object: CpdProviderObject) => this.delete(object) }
    ];

    return actions;
  }
  updateTimestamp(): void {
    this.ts = new Date().getTime().toString();
  }
  setSelectedItems(objects: CpdProviderObject[]): void {
    this.selectedItems = objects;
  }
  specialClasses: Record<string, string> = {};
  can_edit: boolean = false;
  can_delete: boolean = false;
  constructor(private cpdService: CpdService, private notify: NotifyService) { }

  delete(object: CpdProviderObject) {
    if (!window.confirm('Are you sure you want to delete this provider? You will not be able to restore it. Note that you cannot delete a provider with associated CPD activities')) {
      return;
    }
    this.cpdService.deleteCpdProvider(object).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

}
