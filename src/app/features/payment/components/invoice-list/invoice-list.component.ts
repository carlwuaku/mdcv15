import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { RenewalService } from 'src/app/features/licenses/renewal.service';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { DataListComponentInterface } from 'src/app/shared/types/DataListComponentInterface';
import { getToday } from 'src/app/shared/utils/dates';
import { InvoiceObject } from '../../models/InvoiceModel';
import { PaymentService } from '../../payment.service';
import { InvoiceDetailsComponent } from '../invoice-details/invoice-details.component';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements DataListComponentInterface<InvoiceObject>, OnInit, OnChanges {
  @Input() url: string = "";
  baseUrl: string = "";

  selectedItems: InvoiceObject[] = [];

  @Input() showFilters: boolean = false;
  ts: string = "";
  @Output() onSelectedItemsChange = new EventEmitter<InvoiceObject[]>();
  @Input() filterSubmitted: ((params: string) => void) = () => { };
  canDelete: boolean = false;
  constructor(private authService: AuthService, private notify: NotifyService, public dialog: MatDialog,
    private paymentService: PaymentService,) {
    this.canDelete = this.authService.currentUser?.permissions.includes("Delete_Payment_Invoices") || false
  }

  ngOnInit(): void {

  }

  ngOnChanges(): void {

  }

  setSelectedItems(objects: InvoiceObject[]): void {
    this.selectedItems = objects;
    this.onSelectedItemsChange.emit(objects);
  }
  specialClasses: Record<string, string> = {};


  getActions = (object: InvoiceObject): DataActionsButton[] => {
    const actions: DataActionsButton[] = [
      { label: "View details", type: "button", onClick: (object: InvoiceObject) => this.viewInvoice(object) },
      { label: "Delete", type: "button", onClick: (object: InvoiceObject) => this.delete(object) }
    ];

    return actions;
  }
  delete(object: InvoiceObject) {
    if (!window.confirm('Are you sure you want to delete this invoice? You will not be able to restore it.')) {
      return
    }
    this.paymentService.deleteInvoice(object.uuid).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  public updateTimestamp() {
    this.ts = getToday("timestamp_string");
  }

  viewInvoice(object: InvoiceObject) {

    this.paymentService.getInvoice(object.uuid).subscribe({
      next: response => {
        this.openInvoiceDetailsDialog(response.data)
      },
      error: error => { }
    })
  }

  openInvoiceDetailsDialog(data: InvoiceObject) {
    const invoiceDialogRef = this.dialog.open(InvoiceDetailsComponent, {
      data,
      width: '90%',
      maxHeight: '90%',
    })


  }




  public reload() {
    this.updateTimestamp();
  }

}
