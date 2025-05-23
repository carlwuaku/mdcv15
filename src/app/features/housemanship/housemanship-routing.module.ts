import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HousemanshipComponent } from './housemanship.component';
import { FacilityFormComponent } from './pages/facility-form/facility-form.component';
import { FacilitiesComponent } from './pages/facilities/facilities.component';
import { FacilityDetailsComponent } from './pages/facility-details/facility-details.component';
import { DisciplinesComponent } from './pages/disciplines/disciplines.component';
import { HousemanshipPostingsListComponent } from './components/housemanship-postings-list/housemanship-postings-list.component';
import { PostingFormComponent } from './pages/posting-form/posting-form.component';
import { PostingsComponent } from './pages/postings/postings.component';
import { PostingApplicationFormComponent } from './pages/posting-application-form/posting-application-form.component';
import { PostingApplicationsComponent } from './pages/posting-applications/posting-applications.component';

const routes: Routes = [{ path: '', component: HousemanshipComponent },
{ path: 'facilities/add', data: { title: "Add a new housemanship facility" }, component: FacilityFormComponent },
{ path: 'facilities/edit/:id', data: { title: "Edit a housemanship facility" }, component: FacilityFormComponent },
{ path: 'facilities', data: { title: "Housemanship facilities" }, component: FacilitiesComponent },
{ path: 'facilities/details/:id', data: { title: "Housemanship facility details" }, component: FacilityDetailsComponent },
{ path: 'disciplines', data: { title: "Manage housemanship disciplines" }, component: DisciplinesComponent },
{ path: 'postings', data: { title: "Manage housemanship postings" }, component: PostingsComponent },
{ path: 'postings/add/:session', data: { title: "New housemanship posting" }, component: PostingFormComponent },
{ path: 'postings/edit/:id', data: { title: "Edit housemanship posting" }, component: PostingFormComponent },
{ path: 'posting-applications/add/:session', data: { title: "New housemanship posting application" }, component: PostingApplicationFormComponent },
{ path: 'posting-applications/edit/:id', data: { title: "New housemanship posting application" }, component: PostingApplicationFormComponent },
{ path: 'posting-applications/:session', data: { title: "Manage housemanship posting applications" }, component: PostingApplicationsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HousemanshipRoutingModule { }
