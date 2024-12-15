import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationFormsComponent } from './application-forms.component';
import { ManageFormComponent } from './manage-form/manage-form.component';
import { SelectFormTypeComponent } from './select-form-type/select-form-type.component';

const routes: Routes = [
  { path: '', component: ApplicationFormsComponent },
  { path: 'application/:id', component: ManageFormComponent, data: { title: 'Manage application' } },
  { path: 'application-types', component: SelectFormTypeComponent, data: { title: 'Select application' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationFormsRoutingModule { }
