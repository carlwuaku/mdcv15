import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { FeesFormComponent } from './pages/fees-form/fees-form.component';
import { FeesComponent } from './pages/fees/fees.component';

const routes: Routes = [{ path: '', component: PaymentComponent },
{ path: 'fees/add', component: FeesFormComponent, data: { title: 'Add new fee' } },
{ path: 'fees/edit/:id', component: FeesFormComponent, data: { title: 'Edit fee' } },
{ path: 'fees', component: FeesComponent, data: { title: 'Fees' } },
{ path: 'invoices', component: PaymentComponent, data: { title: 'Invoices' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
