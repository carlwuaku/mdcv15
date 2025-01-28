import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CpdRoutingModule } from './cpd-routing.module';
import { CpdComponent } from './pages/list/cpd.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetailsComponent } from './pages/details/details.component';
import { CpdSessionComponent } from './components/cpd-session/cpd-session.component';
import { ProvidersListComponent } from './pages/providers-list/providers-list.component';
import { ProvidersFormComponent } from './pages/providers-form/providers-form.component';
import { ProvidersDetailsComponent } from './pages/providers-details/providers-details.component';
import { CpdFormComponent } from './pages/cpd-form/cpd-form.component';
import { CpdAttendanceComponent } from './components/cpd-attendance/cpd-attendance.component';
import { ManageCpdAttendanceComponent } from './pages/manage-cpd-attendance/manage-cpd-attendance.component';
import { CpdListComponent } from './components/cpd-list/cpd-list.component';
import { LicenseCpdHistoryComponent } from './components/license-cpd-history/license-cpd-history.component';


@NgModule({
  declarations: [
    CpdComponent,
    DetailsComponent,
    CpdSessionComponent,
    ProvidersListComponent,
    ProvidersFormComponent,
    ProvidersDetailsComponent,
    CpdFormComponent,
    CpdAttendanceComponent,
    ManageCpdAttendanceComponent,
    CpdListComponent,
    LicenseCpdHistoryComponent
  ],
  imports: [
    CommonModule,
    CpdRoutingModule,
    SharedModule
  ],
  exports: [
    CpdComponent,
    CpdAttendanceComponent,
    LicenseCpdHistoryComponent
  ]
})
export class CpdModule { }
