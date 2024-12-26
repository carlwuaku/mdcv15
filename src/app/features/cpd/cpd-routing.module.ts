import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CpdComponent } from './pages/list/cpd.component';
import { ProvidersListComponent } from './pages/providers-list/providers-list.component';
import { ProvidersFormComponent } from './pages/providers-form/providers-form.component';
import { ProvidersDetailsComponent } from './pages/providers-details/providers-details.component';
import { CpdFormComponent } from './pages/cpd-form/cpd-form.component';
import { DetailsComponent } from './pages/details/details.component';

const routes: Routes = [
  { path: '', component: CpdComponent, data: { title: 'List all CPDs' } },
  { path: 'list_cpd', component: CpdComponent, data: { title: 'List all CPDs' } },
  { path: 'providers', component: ProvidersListComponent, data: { title: 'List all providers' } },
  { path: 'add', component: CpdFormComponent, data: { title: 'Add a new topic' } },
  { path: 'edit/:id', component: CpdFormComponent, data: { title: 'Edit a topic' } },
  { path: 'details/:id', component: DetailsComponent, data: { title: 'CPD details' } },
  { path: 'providers/:id', component: ProvidersDetailsComponent, data: { title: 'CPD provider details' } },
  { path: 'providers-form', component: ProvidersFormComponent, data: { title: 'Add new CPD provider details' } },
  { path: 'providers-form/:id', component: ProvidersFormComponent, data: { title: 'Edit CPD provider details' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CpdRoutingModule { }
