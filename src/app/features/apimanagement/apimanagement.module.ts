import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiManagementRoutingModule } from './apimanagement-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { InstitutionsListComponent } from './pages/institutions-list/institutions-list.component';
import { InstitutionsFormComponent } from './pages/institutions-form/institutions-form.component';
import { ApiKeysListComponent } from './pages/api-keys-list/api-keys-list.component';
import { ApiKeysDetailsComponent } from './pages/api-keys-details/api-keys-details.component';
import { ApiKeysFormComponent } from './pages/api-keys-form/api-keys-form.component';

@NgModule({
  declarations: [
    InstitutionsListComponent,
    InstitutionsFormComponent,
    ApiKeysListComponent,
    ApiKeysDetailsComponent,
    ApiKeysFormComponent
  ],
  imports: [
    CommonModule,
    ApiManagementRoutingModule,
    SharedModule
  ],
  exports: [
    InstitutionsListComponent,
    ApiKeysListComponent
  ]
})
export class ApiManagementModule { }
