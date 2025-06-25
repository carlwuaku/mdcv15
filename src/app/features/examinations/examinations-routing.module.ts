import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExaminationsComponent } from './examinations.component';
import { ExaminationFormComponent } from './pages/examination-form/examination-form.component';
import { ExaminationDetailsComponent } from './pages/examination-details/examination-details.component';
import { ExamAttendanceComponent } from './pages/exam-attendance/exam-attendance.component';

const routes: Routes = [
  { path: '', data: { title: "List of Examinations" }, component: ExaminationsComponent },
  { path: 'add', data: { title: "Add New Examinations" }, component: ExaminationFormComponent },
  { path: 'edit/:id', data: { title: "Edit Examinations" }, component: ExaminationFormComponent },
  { path: 'details/:id', data: { title: "Examinations Details" }, component: ExaminationDetailsComponent },
  { path: 'attendance/:id', data: { title: "Examinations Attendance" }, component: ExamAttendanceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExaminationsRoutingModule { }
