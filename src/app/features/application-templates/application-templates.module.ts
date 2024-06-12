import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationTemplatesRoutingModule } from './application-templates-routing.module';
import { ApplicationTemplatesComponent } from './application-templates.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TemplateFormComponent } from './template-form/template-form.component';
import { PreviewTemplateComponent } from './preview-template/preview-template.component';


@NgModule({
  declarations: [
    ApplicationTemplatesComponent,
    TemplateFormComponent,
    PreviewTemplateComponent
  ],
  imports: [
    CommonModule,
    ApplicationTemplatesRoutingModule,
    SharedModule
  ]
})
export class ApplicationTemplatesModule { }
