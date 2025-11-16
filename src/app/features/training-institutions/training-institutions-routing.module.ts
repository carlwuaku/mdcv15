import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingInstitutionsComponent } from './training-institutions.component';
import { InstitutionsListComponent } from './components/institutions-list/institutions-list.component';
import { InstitutionFormComponent } from './components/institution-form/institution-form.component';
import { InstitutionLimitsComponent } from './components/institution-limits/institution-limits.component';
import { TrainingInstitutionDetailsComponent } from './pages/training-institution-details/training-institution-details.component';

const routes: Routes = [
  { path: 'list', component: InstitutionsListComponent, data: { title: 'Training Institutions' } },
  { path: 'new', component: InstitutionFormComponent, data: { title: 'Add New Training Institution' } },
  { path: 'edit/:uuid', component: InstitutionFormComponent, data: { title: 'Edit Training Institution' } },
  { path: 'details/:uuid', component: TrainingInstitutionDetailsComponent, data: { title: 'Training Institution Details' } },
  { path: 'limits/:uuid', component: InstitutionLimitsComponent, data: { title: 'Manage Institution Limits' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingInstitutionsRoutingModule { }
