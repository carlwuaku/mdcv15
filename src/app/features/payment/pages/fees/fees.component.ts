import { Component } from '@angular/core';
import { FeesObject } from '../../models/FeesModel';
import { DataListComponentInterface } from 'src/app/shared/types/DataListComponentInterface';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { PaymentService } from '../../payment.service';

@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.scss']
})
export class FeesComponent implements DataListComponentInterface<FeesObject> {
  baseUrl: string = `payment/fees`;
  url: string = `payment/fees`;
  ts: string = "";
  selectedItems: FeesObject[] = [];
  getActions = (object: FeesObject): DataActionsButton[] => {
    const actions: DataActionsButton[] = [
      { label: "Edit", type: "link", link: `payment/fees/edit/`, linkProp: 'id' },
      { label: "Delete", type: "button", onClick: (object: FeesObject) => this.delete(object) }
    ];

    return actions;
  }
  updateTimestamp(): void {
    this.ts = new Date().getTime().toString();
  }
  setSelectedItems(objects: FeesObject[]): void {
    this.selectedItems = objects;
  }
  specialClasses: Record<string, string> = {};
  can_edit: boolean = false;
  can_delete: boolean = false;
  constructor(private paymentService: PaymentService, private notify: NotifyService) { }

  delete(object: FeesObject) {
    if (!window.confirm('Are you sure you want to delete this fee? You will not be able to restore it.')) {
      return;
    }
    //    this.cpdService.deleteCpdProvider(object).subscribe({
    //      next: response => {
    //        this.notify.successNotification(response.message);
    //        this.updateTimestamp();
    //      },
    //      error: error => { }
    //    })
  }

}
