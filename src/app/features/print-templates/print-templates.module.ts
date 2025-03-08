import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrintTemplatesRoutingModule } from './print-templates-routing.module';
import { PrintTemplatesComponent } from './print-templates.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreatePrintTemplateComponent } from './components/create-print-template/create-print-template.component';


@NgModule({
  declarations: [
    PrintTemplatesComponent,
    CreatePrintTemplateComponent,

  ],
  imports: [
    CommonModule,
    PrintTemplatesRoutingModule,
    SharedModule
  ],
})
export class PrintTemplatesModule { }
