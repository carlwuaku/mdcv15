import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PractitionersComponent } from './practitioners.component';

const routes: Routes = [{ path: '', component: PractitionersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PractitionersRoutingModule { }
