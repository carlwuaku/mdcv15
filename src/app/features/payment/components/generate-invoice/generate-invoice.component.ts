import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getLabel, matchesCriteria } from 'src/app/shared/utils/helper';
import { InvoiceItemObject } from '../../models/InvoiceItem';
import { MatTableDataSource } from '@angular/material/table';
import { EditableColumn } from 'src/app/shared/components/table/table.component';
import { FeesObject } from '../../models/FeesModel';
import { PaymentService } from '../../payment.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { AppService } from 'src/app/app.service';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-generate-invoice',
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.scss']
})
export class GenerateInvoiceComponent implements OnInit, OnChanges, OnDestroy {
  @Input() uuids: string[] = [];
  @Input() objects: any[] = [];
  @Input() exclusion_keys = ['id', 'created_by', 'modified_on', 'deleted', 'deleted_by', 'password_hash', 'last_ip'];
  @Input() templateId: string | null = null;
  @Input() showTemplateSelection: boolean = true;
  @Input() showExport: boolean = true;
  @Input() labelField: string = "name,license_number";//this can be a comma-separated list of properties
  @Input() uuidField: string = "uuid";
  @Input() showButton: boolean = true;
  @Input() activityType: string = '';
  dueDate: string | null = null
  payersList: { name: string, uuid: string, invoiceItems: InvoiceItemObject[], invoiceItemsTableDataSource: MatTableDataSource<InvoiceItemObject> }[] = [];
  additionalFees: InvoiceItemObject[] = [];
  @ViewChild('invoiceDialog') invoiceDialog!: TemplateRef<any>;
  getLabel = getLabel;
  tableDataSource: MatTableDataSource<InvoiceItemObject> = new MatTableDataSource<InvoiceItemObject>([]);
  displayedColumns: string[] = ["name", "service_code", "quantity", "unit_price", "line_total"];
  columnLabels: { [key: string]: string } = {
    unitPrice: 'Rate',
    lineTotal: 'Total'
  }
  editableColumns: EditableColumn[] = [
    { field: 'quantity', type: 'text', options: [], validator: (value) => value.length > 0, onChange: (value, row) => { row.line_total = value * row.unit_price; } },
  ];
  loading: boolean = true;
  paymentPurposes: string[] = [];
  selectedPaymentPurpose: string = 'Invoice';
  destroy$: Subject<boolean> = new Subject();
  @Input() licenseType: string = ''
  constructor(private dialog: MatDialog, private appService: AppService, private paymentService: PaymentService, private notify: NotifyService) {

  }
  ngOnInit(): void {
    this.prepPaymentPurposes();

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.prepPaymentPurposes();
  }

  public prepList(paymentPurpose: string) {
    this.uuids = this.objects.map((object) => object[this.uuidField]);
    this.loading = true
    this.paymentService.previewInvoices({ purpose: paymentPurpose, uuids: this.uuids }).subscribe({
      next: (res) => {
        this.payersList = this.objects.map((object) => {
          const uuid = object[this.uuidField];
          const name = this.getLabel(object, this.labelField);
          const dataSource = new MatTableDataSource<InvoiceItemObject>(res.data[uuid]);
          return { name, uuid, invoiceItems: res.data[uuid], invoiceItemsTableDataSource: dataSource };
        });
        this.loading = false
      }, error: (err) => {
        this.loading = false
      }
    });
  }

  prepPaymentPurposes() {
    this.paymentPurposes = [];
    if (this.objects.length === 0) return;
    this.appService.appSettings.pipe(take(1)).subscribe(data => {
      //since we can only generate invoices for one purpose at a time all objects must meet the criteria of a purpose before it is available
      const map = new Map(Object.entries(data.payments.purposes));
      map.forEach((value, key) => {
        if (value.licenseTypes && value.licenseTypes.length > 0 && value.licenseTypes.includes(this.licenseType)) {
          //check that oall bjects meet the criteria for a given purpose
          if (matchesCriteria(value.licenseCriteria, this.objects) && value.activityTypes.includes(this.activityType)) {
            this.paymentPurposes.push(key);
          }
        }
      })
    });

  }


  openDialog(paymentPurpose: string) {
    this.selectedPaymentPurpose = paymentPurpose
    this.prepList(paymentPurpose);
    this.dialog.open(this.invoiceDialog, {
      data: { objects: this.objects, templateId: this.templateId },
      width: '90%',
      maxHeight: '90%',

    });

    //TODO: Add an event emitter to signal when dialog is closed
  }

  onAdditionalFeeSelected(fee: FeesObject) {
    //if the fee has already been added, increment the quantity and give an alert
    if (this.additionalFees.find((item) => item.name === fee.name)) {
      this.notify.infoNotification(`${fee.name} has already been added`);
      return
    }
    this.additionalFees.push({
      name: fee.name,
      quantity: 1,
      unit_price: fee.rate,
      service_code: fee.service_code,
      line_total: fee.rate,
      id: ''
    });
    this.setAdditionalFeesTableDataSource();
  }

  setAdditionalFeesTableDataSource() {
    this.tableDataSource = new MatTableDataSource<InvoiceItemObject>(this.additionalFees);
  }

  setDueDate(date: string) {
    this.dueDate = date;
  }


  submitInvoice() {
    if (!window.confirm(`Are you sure you want to submit these invoices? Please note that if there is an existing ${this.selectedPaymentPurpose} invoice for any of the licenses it will NOT be overwritten. To regenerate an invoice, pleae delete the existing one and generate a new one.`)) {
      return;
    }
    if (!this.dueDate) {
      this.notify.infoNotification("Please select a due date");
      return;
    }
    this.paymentService.submitInvoice({ dueDate: this.dueDate, additionalItems: this.additionalFees, uuids: this.uuids, purpose: this.selectedPaymentPurpose }).subscribe({
      next: (res) => {
        this.notify.infoNotification(res.message);
        this.dialog.closeAll();
      },
      error: (err) => {
        this.notify.failNotification(err.message);
      }
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
