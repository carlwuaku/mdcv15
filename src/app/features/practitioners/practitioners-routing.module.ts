import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PractitionersComponent } from './practitioners.component';
import { PractitionerFormComponent } from './practitioner-form/practitioner-form.component';
import { PractitionerDetailsComponent } from './practitioner-details/practitioner-details.component';
import { RenewalCertificateComponent } from '../licenses/components/renewal/renewal-certificate/renewal-certificate.component';
import { RenewalFormComponent } from '../licenses/components/renewal/renewal-form/renewal-form.component';
import { RenewalComponent } from '../licenses/components/renewal/renewal.component';

const routes: Routes = [
  { path: '', data: { title: 'Practitioners' }, component: PractitionersComponent },
  { path: 'practitioner-form', data: { title: 'Create Practitioner' }, component: PractitionerFormComponent },
  { path: 'practitioner-form/:id', data: { title: 'Edit Practitioner' }, component: PractitionerFormComponent },
  { path: 'practitioner-details/:id', component: PractitionerDetailsComponent },
  { path: 'renewals', data: { title: 'Renewals' }, component: RenewalComponent },
  { path: 'renewal-form', data: { title: 'Create Renewal' }, component: RenewalFormComponent },
  { path: 'renewal-form/:id', data: { title: 'Edit Renewal' }, component: RenewalFormComponent },
  { path: 'renewal-certificate/:id', data: { title: 'Print Renewal Certificate' }, component: RenewalCertificateComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PractitionersRoutingModule { }
