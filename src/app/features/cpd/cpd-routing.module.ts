import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './pages/form/form.component';
import { CpdComponent } from './pages/list/cpd.component';

const routes: Routes = [
  { path: '', component: CpdComponent },
  { path: 'list_cpd', component: CpdComponent },
  { path: 'add', component: FormComponent },
  { path: 'edit/:id', component: FormComponent },
  { path: 'details/:id', component: CpdComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CpdRoutingModule { }
