import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationFormsRoutingModule } from './application-forms-routing.module';
import { ApplicationFormsComponent } from './application-forms.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageFormComponent } from './manage-form/manage-form.component';


@NgModule({
  declarations: [
    ApplicationFormsComponent,
    ManageFormComponent
  ],
  imports: [
    CommonModule,
    ApplicationFormsRoutingModule,
    SharedModule
  ]
})
export class ApplicationFormsModule { }
