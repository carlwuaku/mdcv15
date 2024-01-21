import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PractitionersComponent } from './practitioners.component';
import { PractitionerFormComponent } from './practitioner-form/practitioner-form.component';
import { PractitionerDetailsComponent } from './practitioner-details/practitioner-details.component';

const routes: Routes = [
  { path: '', component: PractitionersComponent },
  { path: 'practitioner-form', component: PractitionerFormComponent },
  { path: 'practitioner-form/:id', component: PractitionerFormComponent },
  { path: 'practitioner-details/:id', component: PractitionerDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PractitionersRoutingModule { }
