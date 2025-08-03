import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceItemObject } from '../../models/InvoiceItem';
import { InvoiceObject } from '../../models/InvoiceModel';
import { InvoiceDetailsComponent } from '../invoice-details/invoice-details.component';
import { FormGeneratorComponentInterface } from 'src/app/shared/types/FormGeneratorComponentInterface';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';

@Component({
  selector: 'app-invoice-payment-dialog',
  templateUrl: './invoice-payment-dialog.component.html',
  styleUrls: ['./invoice-payment-dialog.component.scss']
})
export class InvoicePaymentDialogComponent implements FormGeneratorComponentInterface {
  invoice: InvoiceObject;
  title: string = "Add a new payment fee";
  formUrl: string = "payment/invoices/manual-payment";
  existingUrl: string = "";
  fields: IFormGenerator[] = [

    {
      label: "File",
      name: "payment_file",
      hint: "",
      options: [],
      type: "file",
      value: "",
      required: true,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
      assetType: "payments",
      file_types: "application/pdf,image/jpg,image/jpeg,image/png"
    },
    {
      label: "Payment date",
      name: "payment_date",
      hint: "The date on which the payment was made",
      options: [],
      type: "date",
      value: "",
      required: true
    }


  ];
  id: string = "";
  constructor(public dialogRef: MatDialogRef<InvoicePaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InvoiceObject) {

    this.invoice = data
    this.formUrl = `payment/invoices/manual-payment/${this.invoice.uuid}`;
    this.id = this.invoice.uuid
  }

  formSubmitted(args: boolean): void {
    if (args) {
      this.dialogRef.close(true);
    }
  }
}
