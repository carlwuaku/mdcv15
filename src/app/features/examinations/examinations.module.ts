import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExaminationsRoutingModule } from './examinations-routing.module';
import { ExaminationsComponent } from './examinations.component';
import { ExaminationFormComponent } from './pages/examination-form/examination-form.component';
import { ExaminationDetailsComponent } from './pages/examination-details/examination-details.component';
import { ExaminationsListComponent } from './pages/examinations-list/examinations-list.component';
import { ExaminationHistoryComponent } from './components/examination-history/examination-history.component';
import { ExaminationApplicationCountsComponent } from './components/examination-application-counts/examination-application-counts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExaminationLettersComponent } from './components/examination-letters/examination-letters.component';
import { AddExamRegistrationComponent } from './components/add-exam-registration/add-exam-registration.component';
import { ExaminationRegistrationsListComponent } from './components/examination-registrations-list/examination-registrations-list.component';
import { ExaminationApplicationsListComponent } from './components/examination-applications-list/examination-applications-list.component';
import { AssignIndexNumbersComponent } from './components/assign-index-numbers/assign-index-numbers.component';
import { SetCustomLetterComponent } from './components/set-custom-letter/set-custom-letter.component';


@NgModule({
  declarations: [
    ExaminationsComponent,
    ExaminationFormComponent,
    ExaminationDetailsComponent,
    ExaminationsListComponent,
    ExaminationHistoryComponent,
    ExaminationApplicationCountsComponent,
    ExaminationLettersComponent,
    AddExamRegistrationComponent,
    ExaminationRegistrationsListComponent,
    ExaminationApplicationsListComponent,
    AssignIndexNumbersComponent,
    SetCustomLetterComponent
  ],
  imports: [
    CommonModule,
    ExaminationsRoutingModule,
    SharedModule
  ]
})
export class ExaminationsModule { }
