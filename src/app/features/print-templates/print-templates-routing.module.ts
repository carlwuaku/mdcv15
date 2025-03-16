import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrintTemplatesComponent } from './print-templates.component';
import { CreatePrintTemplateComponent } from './components/create-print-template/create-print-template.component';
import { PermissionsGuard } from 'src/app/core/auth/permissions.guard';
const routes: Routes = [
  { path: '', component: PrintTemplatesComponent, data: { title: 'Print templates' } },
  { path: 'create', component: CreatePrintTemplateComponent, data: { title: 'Create print template', permission: 'Create_Print_Templates' }, canActivate: [PermissionsGuard] },
  { path: 'edit/:id', component: CreatePrintTemplateComponent, data: { title: 'Edit print template', permission: 'Edit_Print_Templates' }, canActivate: [PermissionsGuard] }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintTemplatesRoutingModule { }
