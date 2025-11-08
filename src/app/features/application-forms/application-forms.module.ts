import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationFormsRoutingModule } from './application-forms-routing.module';
import { ApplicationFormsComponent } from './application-forms.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageFormComponent } from './manage-form/manage-form.component';
import { SelectFormTypeComponent } from './select-form-type/select-form-type.component';
import { ApplicationTemplatesModule } from '../application-templates/application-templates.module';
import { ApplicationStatusManagerComponent } from './application-status-manager/application-status-manager.component';
import { ApplicationDetailsComponent } from './pages/application-details/application-details.component';
import { ApplicationReportsComponent } from './components/reports/reports.component';


@NgModule({
  declarations: [
    ApplicationFormsComponent,
    ManageFormComponent,
    SelectFormTypeComponent,
    ApplicationStatusManagerComponent,
    ApplicationDetailsComponent,
    ApplicationReportsComponent
  ],
  imports: [
    CommonModule,
    ApplicationFormsRoutingModule,
    SharedModule,
    ApplicationTemplatesModule
  ]
})
export class ApplicationFormsModule { }
