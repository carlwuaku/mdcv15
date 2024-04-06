import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationFormsRoutingModule } from './application-forms-routing.module';
import { ApplicationFormsComponent } from './application-forms.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ApplicationFormsComponent
  ],
  imports: [
    CommonModule,
    ApplicationFormsRoutingModule,
    SharedModule
  ]
})
export class ApplicationFormsModule { }
