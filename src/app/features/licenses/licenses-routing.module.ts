import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LicensesComponent } from './licenses.component';
import { LicenseFormComponent } from './components/license-form/license-form.component';
import { DetailsComponent } from './components/details/details.component';
import { RenewalCertificateComponent } from './components/renewal/renewal-certificate/renewal-certificate.component';
import { RenewalFormComponent } from './components/renewal/renewal-form/renewal-form.component';
import { RenewalComponent } from './components/renewal/renewal.component';

const routes: Routes = [
  { path: '', component: LicensesComponent },
  { path: 'form/:action/:type', component: LicenseFormComponent, data: { title: "Add new license" } },
  { path: 'form/:action/:type/:id', component: LicenseFormComponent, data: { title: "Update license" } },
  { path: 'license-details/:id', component: DetailsComponent, data: { title: "License details" } },
  { path: 'renewals', data: { title: 'Renewals' }, component: RenewalComponent },
  { path: 'renewal-form', data: { title: 'Create Renewal' }, component: RenewalFormComponent },
  { path: 'renewal-form/:id', data: { title: 'Edit Renewal' }, component: RenewalFormComponent },
  { path: 'renewal-certificate/:id', data: { title: 'Print Renewal Certificate' }, component: RenewalCertificateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicensesRoutingModule { }
