import { Component, Input, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getLabel } from 'src/app/shared/utils/helper';
import { InvoiceItemObject } from '../../models/InvoiceItem';
import { MatTableDataSource } from '@angular/material/table';
import { EditableColumn } from 'src/app/shared/components/table/table.component';
import { FeesObject } from '../../models/FeesModel';
import { PaymentService } from '../../payment.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';

@Component({
  selector: 'app-generate-invoice',
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.scss']
})
export class GenerateInvoiceComponent {
  @Input() paymentPurpose: string = ''
  @Input() uuids: string[] = [];
  @Input() objects: any[] = [];
  @Input() exclusion_keys = ['id', 'created_by', 'modified_on', 'deleted', 'deleted_by', 'password_hash', 'last_ip'];
  @Input() templateId: string | null = null;
  @Input() showTemplateSelection: boolean = true;
  @Input() showExport: boolean = true;
  @Input() labelField: string = "name,license_number";//this can be a comma-separated list of properties
  @Input() uuidField: string = "uuid";
  @Input() showButton: boolean = true;
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
  constructor(private dialog: MatDialog, private router: Router, private paymentService: PaymentService, private notify: NotifyService) {
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  public prepList() {
    this.uuids = this.objects.map((object) => object[this.uuidField]);
    this.loading = true
    this.paymentService.previewInvoices({ purpose: this.paymentPurpose, uuids: this.uuids }).subscribe({
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



  openDialog() {
    this.prepList();
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
    if (!window.confirm(`Are you sure you want to submit these invoices? Please note that if there is an existing ${this.paymentPurpose} invoice for any of the licenses it will NOT be overwritten. To regenerate an invoice, pleae delete the existing one and generate a new one.`)) {
      return;
    }
    if (!this.dueDate) {
      this.notify.infoNotification("Please select a due date");
      return;
    }
    this.paymentService.submitInvoice({ dueDate: this.dueDate, additionalItems: this.additionalFees, uuids: this.uuids, purpose: this.paymentPurpose }).subscribe({
      next: (res) => {
        this.notify.infoNotification(res.message);
        this.dialog.closeAll();
      },
      error: (err) => {
        this.notify.failNotification(err.message);
      }
    })
  }
}
