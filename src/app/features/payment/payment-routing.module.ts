import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { FeesFormComponent } from './pages/fees-form/fees-form.component';
import { FeesComponent } from './pages/fees/fees.component';
import { PaymentUploadsComponent } from './pages/payment-uploads/payment-uploads.component';
import { PermissionsGuard } from 'src/app/core/auth/permissions.guard';
import { CreateInvoiceComponent } from 'src/app/features/payment/pages/create-invoice/create-invoice.component';

const routes: Routes = [{ path: '', component: PaymentComponent },
{ path: 'fees/add', component: FeesFormComponent, data: { title: 'Add new fee', permission: 'Create_Payment_Fees' }, canActivate: [PermissionsGuard] },
{ path: 'fees/edit/:id', component: FeesFormComponent, data: { title: 'Edit fee', permission: 'Update_Payment_Fees' }, canActivate: [PermissionsGuard] },
{ path: 'fees', component: FeesComponent, data: { title: 'Fees', permission: 'View_Payment_Fees' }, canActivate: [PermissionsGuard] },
{ path: 'invoices', component: PaymentComponent, data: { title: 'Invoices', permission: 'View_Payment_Invoices' }, canActivate: [PermissionsGuard] },
{ path: 'payment-uploads', component: PaymentUploadsComponent, data: { title: 'Payments pending approval', permission: 'View_Payment_Evidence_File' }, canActivate: [PermissionsGuard] },
{ path: 'create-invoice', component: CreateInvoiceComponent, data: { title: 'Create new invoice', permission: 'View_Payment_Evidence_File' }, canActivate: [PermissionsGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
