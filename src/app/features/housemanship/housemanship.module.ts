import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HousemanshipRoutingModule } from './housemanship-routing.module';
import { HousemanshipComponent } from './housemanship.component';
import { FacilitiesComponent } from './pages/facilities/facilities.component';
import { PostingsComponent } from './pages/postings/postings.component';
import { HousemanshipPostingsListComponent } from './components/housemanship-postings-list/housemanship-postings-list.component';
import { HousemanshipFacilityCapacitiesComponent } from './components/housemanship-facility-capacities/housemanship-facility-capacities.component';
import { HousemanshipFacilityAvailabilityComponent } from './components/housemanship-facility-availability/housemanship-facility-availability.component';
import { FacilityFormComponent } from './pages/facility-form/facility-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FacilityDetailsComponent } from './pages/facility-details/facility-details.component';
import { DisciplinesComponent } from './pages/disciplines/disciplines.component';
import { PostingFormComponent } from './pages/posting-form/posting-form.component';
import { PostingApplicationFormComponent } from './pages/posting-application-form/posting-application-form.component';
import { PostingApplicationsComponent } from './pages/posting-applications/posting-applications.component';
import { PostingApplicationsListComponent } from './components/posting-applications-list/posting-applications-list.component';
import { ConfirmPostingsComponent } from './components/confirm-postings/confirm-postings.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


@NgModule({
  declarations: [
    HousemanshipComponent,
    FacilitiesComponent,
    PostingsComponent,
    HousemanshipPostingsListComponent,
    HousemanshipFacilityCapacitiesComponent,
    HousemanshipFacilityAvailabilityComponent,
    FacilityFormComponent,
    FacilityDetailsComponent,
    DisciplinesComponent,
    PostingFormComponent,
    PostingApplicationFormComponent,
    PostingApplicationsComponent,
    PostingApplicationsListComponent,
    ConfirmPostingsComponent
  ],
  imports: [
    CommonModule,
    HousemanshipRoutingModule,
    SharedModule,
    MatButtonToggleModule
  ]
})
export class HousemanshipModule { }
