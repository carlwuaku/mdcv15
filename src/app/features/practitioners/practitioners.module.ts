import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PractitionersRoutingModule } from './practitioners-routing.module';
import { PractitionersComponent } from './practitioners.component';
import { PractitionerFormComponent } from './practitioner-form/practitioner-form.component';
import { PractitionerDetailsComponent } from './practitioner-details/practitioner-details.component';
import { PractitionerRenewalComponent } from './practitioner-renewal/practitioner-renewal.component';
import { PortalRequestsComponent } from './portal-requests/portal-requests.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditImageComponent } from './components/edit-image/edit-image.component';
import { RenewalIndividualComponent } from './components/renewal/renewal-individual/renewal-individual.component';
import { SpecialistComponent } from './components/specialist/specialist.component';
import { PortalActivationComponent } from './components/portal-activation/portal-activation.component';
import { AdditionalQualificationsComponent } from './components/additional-qualifications/additional-qualifications.component';
import { EditAdditionalQualificationComponent } from './components/additional-qualifications/edit-additional-qualification/edit-additional-qualification.component';
import { WorkHistoryComponent } from './components/work-history/work-history.component';
import { EditWorkHistoryComponent } from './components/work-history/edit-work-history/edit-work-history.component';
import { RenewalComponent } from './components/renewal/renewal.component';
import { RenewalFormComponent } from './components/renewal/renewal-form/renewal-form.component';



@NgModule({
  declarations: [
    PractitionersComponent,
    PractitionerFormComponent,
    PractitionerDetailsComponent,
    PractitionerRenewalComponent,
    PortalRequestsComponent,
    EditImageComponent,
    RenewalIndividualComponent,
    SpecialistComponent,
    PortalActivationComponent,
    AdditionalQualificationsComponent,
    EditAdditionalQualificationComponent,
    WorkHistoryComponent,
    EditWorkHistoryComponent,
    RenewalComponent,
    RenewalFormComponent,
  ],
  imports: [
    CommonModule,
    PractitionersRoutingModule,
    SharedModule
  ]
})
export class PractitionersModule { }
