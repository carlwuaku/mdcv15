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
    PostingFormComponent
  ],
  imports: [
    CommonModule,
    HousemanshipRoutingModule,
    SharedModule
  ]
})
export class HousemanshipModule { }
