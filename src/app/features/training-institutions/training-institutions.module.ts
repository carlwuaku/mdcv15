import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TrainingInstitutionsRoutingModule } from './training-institutions-routing.module';
import { TrainingInstitutionsComponent } from './training-institutions.component';
import { InstitutionsListComponent } from './components/institutions-list/institutions-list.component';
import { InstitutionFormComponent } from './components/institution-form/institution-form.component';
import { InstitutionLimitsComponent } from './components/institution-limits/institution-limits.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TrainingInstitutionDetailsComponent } from './pages/training-institution-details/training-institution-details.component';

@NgModule({
  declarations: [
    TrainingInstitutionsComponent,
    InstitutionsListComponent,
    InstitutionFormComponent,
    InstitutionLimitsComponent,
    TrainingInstitutionDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TrainingInstitutionsRoutingModule,
    SharedModule
  ],
  exports: [
    TrainingInstitutionsComponent
  ]
})
export class TrainingInstitutionsModule { }
