import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LicensesComponent } from './licenses.component';
import { LicenseFormComponent } from './components/license-form/license-form.component';
import { DetailsComponent } from './components/details/details.component';
import { RenewalCertificateComponent } from './components/renewal/renewal-certificate/renewal-certificate.component';
import { RenewalFormComponent } from './components/renewal/renewal-form/renewal-form.component';
import { RenewalComponent } from './components/renewal/renewal.component';
import { RenewalDashboardComponent } from './components/renewal/renewal-dashboard/renewal-dashboard.component';
import { ManageRenewalsComponent } from './components/renewal/manage-renewals/manage-renewals.component';
import { ReportsComponent } from './components/reports/reports.component';
import { AdvancedReportsComponent } from './components/advanced-reports/advanced-reports.component';
const routes: Routes = [
  { path: '', component: LicensesComponent },
  { path: 'list', component: LicensesComponent },
  { path: 'form/:action/:type', component: LicenseFormComponent, data: { title: "Add new license" } },
  { path: 'form/:action/:type/:id', component: LicenseFormComponent, data: { title: "Update license" } },
  { path: 'license-details/:id', component: DetailsComponent, data: { title: "License details" } },
  { path: 'renewals', data: { title: 'Renewals' }, component: RenewalComponent },
  { path: 'renewals-manage', data: { title: 'Manage Renewals' }, component: ManageRenewalsComponent },
  { path: 'renewal', redirectTo: 'renewals-manage' },

  { path: 'renewal-form', data: { title: 'Create Renewal' }, component: RenewalFormComponent },
  { path: 'renewal-form/:id', data: { title: 'Edit Renewal' }, component: RenewalFormComponent },
  { path: 'renewal-certificate/:id', data: { title: 'Print Renewal Certificate' }, component: RenewalCertificateComponent },
  { path: 'renewal-dashboard', data: { title: 'Manage Renewals' }, component: RenewalDashboardComponent },
  { path: 'reports', data: { title: 'Basic Reports' }, component: ReportsComponent },
  { path: 'advanced-reports', data: { title: 'Advanced Reports' }, component: AdvancedReportsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicensesRoutingModule { }
