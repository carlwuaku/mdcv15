import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CpdRoutingModule } from './cpd-routing.module';
import { CpdComponent } from './pages/list/cpd.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetailsComponent } from './pages/details/details.component';
import { FormComponent } from './pages/form/form.component';
import { AddCpdFacilityComponent } from './components/add-cpd-facility/add-cpd-facility.component';
import { CpdSessionComponent } from './components/cpd-session/cpd-session.component';


@NgModule({
  declarations: [
    CpdComponent,
    DetailsComponent,
    FormComponent,
    AddCpdFacilityComponent,
    CpdSessionComponent
  ],
  imports: [
    CommonModule,
    CpdRoutingModule,
    SharedModule
  ]
})
export class CpdModule { }
