import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationTemplatesComponent } from './application-templates.component';
import { TemplateFormComponent } from './template-form/template-form.component';

const routes: Routes = [
  { path: '', component: ApplicationTemplatesComponent,  data: { title: 'Manage templates' } },
  { path: 'form', component: TemplateFormComponent, data: { title: 'Add a new template' }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationTemplatesRoutingModule { }
