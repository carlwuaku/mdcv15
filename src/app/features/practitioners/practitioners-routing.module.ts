import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PractitionersComponent } from './practitioners.component';
import { PractitionerFormComponent } from './practitioner-form/practitioner-form.component';
import { PractitionerDetailsComponent } from './practitioner-details/practitioner-details.component';

const routes: Routes = [
  { path: '', data:{title: 'Practitioners'}, component: PractitionersComponent },
  { path: 'practitioner-form', data:{title: 'Create Practitioner'}, component: PractitionerFormComponent },
  { path: 'practitioner-form/:id', data:{title: 'Edit Practitioner'}, component: PractitionerFormComponent },
  { path: 'practitioner-details/:id', component: PractitionerDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PractitionersRoutingModule { }
