import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PractitionersRoutingModule } from './practitioners-routing.module';
import { PractitionersComponent } from './practitioners.component';


@NgModule({
  declarations: [
    PractitionersComponent
  ],
  imports: [
    CommonModule,
    PractitionersRoutingModule
  ]
})
export class PractitionersModule { }
