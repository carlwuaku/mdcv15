import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrintTemplatesComponent } from './print-templates.component';
import { CreatePrintTemplateComponent } from './components/create-print-template/create-print-template.component';
const routes: Routes = [
  { path: '', component: PrintTemplatesComponent },
  { path: 'create', component: CreatePrintTemplateComponent },
  { path: 'edit/:id', component: CreatePrintTemplateComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintTemplatesRoutingModule { }
