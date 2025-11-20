import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, take } from 'rxjs';
import { LicenseObject } from 'src/app/features/licenses/models/license_model';
import { EditableColumn } from 'src/app/shared/components/table/table.component';
import { getLabel, matchesCriteria } from 'src/app/shared/utils/helper';
import { FeesObject } from '../../models/FeesModel';
import { InvoiceItemObject, InvoiceItemTableObject } from '../../models/InvoiceItem';
import { AppService } from 'src/app/app.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { PaymentService } from '../../payment.service';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { MatDatepickerComponent } from 'src/app/shared/material-components/mat-datepicker/mat-datepicker.component';
@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit, OnDestroy {
  uuids: string[] = [];
  objects: any[] = [];
  templateId: string | null = null;
  showTemplateSelection: boolean = true;
  showExport: boolean = true;
  labelField: string = "name,license_number";//this can be a comma-separated list of properties
  uuidField: string = "uuid";
  showButton: boolean = true;
  activityType: string = '';
  dueDate: string | null = null
  payersList: { name: string, uuid: string, invoiceItems: InvoiceItemObject[], invoiceItemsTableDataSource: MatTableDataSource<InvoiceItemObject> }[] = [];
  additionalFees: InvoiceItemObject[] = [];
  getLabel = getLabel;
  tableDataSource: MatTableDataSource<InvoiceItemTableObject> = new MatTableDataSource<InvoiceItemTableObject>([]);
  displayedColumns: string[] = ["#", "actions", "name", "service_code", "quantity", "unit_price", "line_total"];
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
  selectedLicense: LicenseObject | null = null;
  description: string = '';
  @ViewChild('datePicker') datePicker!: MatDatepickerComponent;
  constructor(private appService: AppService, private paymentService: PaymentService, private notify: NotifyService) {

  }
  onLicenseSelected(license: LicenseObject) {
    console.log(license);
    this.selectedLicense = license;
  }

  getActions = (item: InvoiceItemObject): DataActionsButton[] => {

    const actions: DataActionsButton[] = [
      { label: "Remove", type: "button", onClick: (role: InvoiceItemObject) => this.deleteFee(item) }
    ];
    return actions;
  }

  deleteFee(fee: InvoiceItemObject) {
    this.additionalFees = this.additionalFees.filter((item) => item.name !== fee.name);
    this.setAdditionalFeesTableDataSource();
  }

  ngOnInit(): void {
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
    const data: InvoiceItemTableObject[] = this.additionalFees.map((item) => {
      return { ...item, actions: this.getActions(item) }
    })
    this.tableDataSource = new MatTableDataSource<InvoiceItemTableObject>(data);
  }

  setDueDate(date: string) {
    this.dueDate = date;
  }


  submitInvoice() {
    if (!window.confirm(`Are you sure you want to submit these invoices? Please note that if there is an existing ${this.selectedPaymentPurpose} invoice for any of the licenses it will NOT be overwritten. To regenerate an invoice, please delete the existing one and generate a new one.`)) {
      return;
    }
    if (!this.dueDate) {
      this.notify.infoNotification("Please select a due date");
      return;
    }
    if (!this.selectedLicense) {
      this.notify.infoNotification("Please select a license");
      return
    }
    if (!this.description) {
      this.notify.infoNotification("Please enter a description");
      return
    }
    this.paymentService.submitGenericInvoice({ due_date: this.dueDate, items: this.additionalFees, unique_id: this.selectedLicense!.license_number, purpose: this.selectedPaymentPurpose, paymentOptions: [], description: this.description }).subscribe({
      next: (res) => {
        this.notify.infoNotification(res.message);
        //reset the form
        this.additionalFees = [];
        this.dueDate = '';
        this.selectedLicense = null;
        this.description = '';
        this.tableDataSource = new MatTableDataSource<InvoiceItemTableObject>([]);
        this.datePicker.clear();
      },
      error: (err) => {
        this.notify.failNotification(err.message);
      }
    })
  }
  itemQuantityChanged(event: {
    row: InvoiceItemTableObject;
    field: string;
    oldValue: string;
    newValue: string;
  }) {
    if (!event || !event.row || !event.row.name || !event.newValue.trim()) {
      return
    }
    this.additionalFees.forEach((fee) => {
      if (fee.name === event.row.name) {
        fee.quantity = parseFloat(event.newValue);
        fee.line_total = fee.quantity * fee.unit_price;
      }
    })
    this.setAdditionalFeesTableDataSource();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
