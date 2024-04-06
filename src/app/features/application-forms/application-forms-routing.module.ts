import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationFormsComponent } from './application-forms.component';

const routes: Routes = [{ path: '', component: ApplicationFormsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationFormsRoutingModule { }
