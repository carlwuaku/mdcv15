import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationTemplatesRoutingModule } from './application-templates-routing.module';
import { ApplicationTemplatesComponent } from './application-templates.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TemplateFormComponent } from './template-form/template-form.component';
import { PreviewTemplateComponent } from './preview-template/preview-template.component';
import { SelectApplicationTemplateComponent } from './components/select-application-template/select-application-template.component';


@NgModule({
  declarations: [
    ApplicationTemplatesComponent,
    TemplateFormComponent,
    PreviewTemplateComponent,
    SelectApplicationTemplateComponent
  ],
  imports: [
    CommonModule,
    ApplicationTemplatesRoutingModule,
    SharedModule,

  ],
  exports: [
    SelectApplicationTemplateComponent
  ]
})
export class ApplicationTemplatesModule { }
