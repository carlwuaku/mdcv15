import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstitutionsListComponent } from './pages/institutions-list/institutions-list.component';
import { InstitutionsFormComponent } from './pages/institutions-form/institutions-form.component';
import { ApiKeysListComponent } from './pages/api-keys-list/api-keys-list.component';
import { ApiKeysDetailsComponent } from './pages/api-keys-details/api-keys-details.component';
import { ApiKeysFormComponent } from './pages/api-keys-form/api-keys-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'institutions', pathMatch: 'full' },
  { path: 'institutions', component: InstitutionsListComponent, data: { title: 'Institutions' } },
  { path: 'institutions-form', component: InstitutionsFormComponent, data: { title: 'Add Institution' } },
  { path: 'institutions-form/:id', component: InstitutionsFormComponent, data: { title: 'Edit Institution' } },
  { path: 'api-keys', component: ApiKeysListComponent, data: { title: 'API Keys' } },
  { path: 'api-keys/:id', component: ApiKeysDetailsComponent, data: { title: 'API Key Details' } },
  { path: 'api-keys-form', component: ApiKeysFormComponent, data: { title: 'Generate API Key' } },
  { path: 'api-keys-form/:id', component: ApiKeysFormComponent, data: { title: 'Edit API Key' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiManagementRoutingModule { }
