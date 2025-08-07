import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import { FeesComponent } from './pages/fees/fees.component';
import { FeesFormComponent } from './pages/fees-form/fees-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InvoiceFormComponent } from './pages/invoice-form/invoice-form.component';
import { GenerateInvoiceComponent } from './components/generate-invoice/generate-invoice.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { InvoiceDetailsComponent } from './components/invoice-details/invoice-details.component';
import { InvoicePaymentDialogComponent } from './components/invoice-payment-dialog/invoice-payment-dialog.component';
import { PaymentUploadsComponent } from './pages/payment-uploads/payment-uploads.component';
import { PrintInvoicesComponent } from './components/print-invoices/print-invoices.component';


@NgModule({
  declarations: [
    PaymentComponent,
    FeesComponent,
    FeesFormComponent,
    InvoiceFormComponent,
    GenerateInvoiceComponent,
    InvoiceListComponent,
    InvoiceDetailsComponent,
    InvoicePaymentDialogComponent,
    PaymentUploadsComponent,
    PrintInvoicesComponent
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    SharedModule
  ],
  exports: [
    GenerateInvoiceComponent,
    InvoiceListComponent
  ]
})
export class PaymentModule { }
