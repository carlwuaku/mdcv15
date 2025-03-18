import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LicensesRoutingModule } from './licenses-routing.module';
import { LicensesComponent } from './licenses.component';
import { LicenseFormComponent } from './components/license-form/license-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetailsComponent } from './components/details/details.component';
import { RenewalIndividualComponent } from './components/renewal/renewal-individual/renewal-individual.component';
import { SpecialistComponent } from './components/specialist/specialist.component';
import { PortalActivationComponent } from './components/portal-activation/portal-activation.component';
import { AdditionalQualificationsComponent } from './components/additional-qualifications/additional-qualifications.component';
import { EditAdditionalQualificationComponent } from './components/additional-qualifications/edit-additional-qualification/edit-additional-qualification.component';
import { WorkHistoryComponent } from './components/work-history/work-history.component';
import { EditWorkHistoryComponent } from './components/work-history/edit-work-history/edit-work-history.component';
import { RenewalComponent } from './components/renewal/renewal.component';
import { RenewalFormComponent } from './components/renewal/renewal-form/renewal-form.component';
import { RenewalCertificateComponent } from './components/renewal/renewal-certificate/renewal-certificate.component';
import { RenewalDashboardComponent } from './components/renewal/renewal-dashboard/renewal-dashboard.component';
import { ManageRenewalsComponent } from './components/renewal/manage-renewals/manage-renewals.component';
import { CpdModule } from '../cpd/cpd.module';
import { ReportsComponent } from './components/reports/reports.component';
import { AdvancedReportsComponent } from './components/advanced-reports/advanced-reports.component';

@NgModule({
  declarations: [
    LicensesComponent,
    LicenseFormComponent,
    DetailsComponent,
    RenewalIndividualComponent,
    SpecialistComponent,
    PortalActivationComponent,
    AdditionalQualificationsComponent,
    EditAdditionalQualificationComponent,
    WorkHistoryComponent,
    EditWorkHistoryComponent,
    RenewalComponent,
    RenewalFormComponent,
    RenewalCertificateComponent,
    RenewalDashboardComponent,
    ManageRenewalsComponent,
    ReportsComponent,
    AdvancedReportsComponent,
  ],
  imports: [
    CommonModule,
    LicensesRoutingModule,
    SharedModule,
    CpdModule
  ],
  exports: [
    LicensesComponent,
  ]
})
export class LicensesModule { }
