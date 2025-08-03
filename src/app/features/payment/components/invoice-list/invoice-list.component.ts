import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
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
import { InvoicePaymentDialogComponent } from '../invoice-payment-dialog/invoice-payment-dialog.component';
import { DEFAULT_DIALOG_POSITION } from 'src/app/shared/utils/constants';
import { TableLegendType } from 'src/app/shared/components/table/tableLegend.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements DataListComponentInterface<InvoiceObject>, OnInit, OnChanges, OnDestroy {
  @Input() url: string = "";
  baseUrl: string = "";

  selectedItems: InvoiceObject[] = [];

  @Input() showFilters: boolean = false;
  ts: string = "";
  @Output() onSelectedItemsChange = new EventEmitter<InvoiceObject[]>();
  @Input() filterSubmitted: ((params: string) => void) = () => { };
  canDelete: boolean = false;
  canSubmitPayment: boolean = false;
  tableClassRules = {
    'bg-light-green': (row: InvoiceObject) => row.status?.toLowerCase() === 'paid'
  };

  tableLegends: TableLegendType[] = [
    { classrule: 'bg-light-green', label: 'Paid' }
  ]
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private authService: AuthService, private notify: NotifyService, public dialog: MatDialog,
    private paymentService: PaymentService,) {
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.authService.getUser().pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        this.canDelete = response.permissions.includes("Delete_Payment_Invoices") || false;
        this.canSubmitPayment = response.permissions.includes("Submit_Invoice_Payments") || false;
      }
    })

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
      ...(this.canSubmitPayment && object.status == "Pending" ? [{ label: "Upload payment evidence", type: "button" as "button", onClick: (object: InvoiceObject) => this.submitPayment(object) }] : []),
      ...(this.canDelete && object.status !== "Paid" ? [{ label: "Delete", type: "button" as "button", onClick: (object: InvoiceObject) => this.delete(object) }] : [])
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

  submitPayment(object: InvoiceObject) {
    if (!this.canSubmitPayment) {
      return;
    }
    const invoiceDialogRef = this.dialog.open(InvoicePaymentDialogComponent, {
      data: object,
      maxWidth: '90%',
      minWidth: '400px',
      maxHeight: '90%',
      position: DEFAULT_DIALOG_POSITION
    })
    invoiceDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateTimestamp();
      }
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
