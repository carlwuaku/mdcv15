import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PractitionersRoutingModule } from './practitioners-routing.module';
import { PractitionersComponent } from './practitioners.component';
import { PractitionerFormComponent } from './practitioner-form/practitioner-form.component';
import { PractitionerDetailsComponent } from './practitioner-details/practitioner-details.component';
import { PractitionerRenewalComponent } from './practitioner-renewal/practitioner-renewal.component';
import { SharedModule } from 'src/app/shared/shared.module';




@NgModule({
  declarations: [
    PractitionersComponent,
    PractitionerFormComponent,
    PractitionerDetailsComponent,
    PractitionerRenewalComponent,

  ],
  imports: [
    CommonModule,
    PractitionersRoutingModule,
    SharedModule
  ],
  exports: [
    PractitionersComponent,
    PractitionerRenewalComponent
  ]
})
export class PractitionersModule { }
