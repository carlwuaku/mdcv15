import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LicenseObject } from 'src/app/features/licenses/models/license_model';
import { ExaminationRegistrationObject } from '../../models/examination-registration.model';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { ExaminationService } from '../../examination.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-assign-index-numbers',
  templateUrl: './assign-index-numbers.component.html',
  styleUrls: ['./assign-index-numbers.component.scss']
})
export class AssignIndexNumbersComponent {
  candidates: LicenseObject[] = [];
  registrations: ExaminationRegistrationObject[] = [];
  examId: string = '';
  tableDataSource: MatTableDataSource<ExaminationRegistrationObject> = new MatTableDataSource<ExaminationRegistrationObject>([]);
  displayedColumns: string[] = ['intern_code', 'first_name', 'last_name', 'index_number'];
  columnLabels: { [key: string]: string } = {
    license_number: 'Intern Code',
  }
  constructor(
    public dialogRef: MatDialogRef<AssignIndexNumbersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { candidates: LicenseObject[], examId: string }, private notify: NotifyService, private service: ExaminationService) {
    this.examId = data.examId;

    this.candidates = data.candidates;
  }

  ngOnInit() {
    this.registrations = this.candidates.map(candidate => {
      return {
        intern_code: candidate.license_number,
        index_number: '',
        first_name: candidate['first_name'],
        last_name: candidate['last_name'],
        middle_name: candidate['middle_name'],
        phone_number: candidate['phone_number'],
        email: candidate['email'],
        exam_id: this.examId
      };
    });
    this.tableDataSource = new MatTableDataSource<ExaminationRegistrationObject>(this.registrations);
  }

  submitIndexNumbers() {
    let indexNumbers = this.registrations.map(registration => {
      return {
        intern_code: registration.intern_code,
        index_number: registration.index_number,
        exam_id: registration.exam_id
      };
    });
    if (indexNumbers.some(registration => registration.index_number.trim() === '')) {
      this.notify.failNotification('Please fill in all index numbers');
      return;
    }
    if (indexNumbers.some(registration => registration.index_number.length < 5)) {
      this.notify.failNotification('Index numbers must be at least 5 characters long');
      return;
    }
    if (new Set(indexNumbers.map(registration => registration.index_number)).size !== indexNumbers.length) {
      this.notify.failNotification('Index numbers must be unique');
      return;
    }
    if (indexNumbers.some(registration => registration.intern_code.trim() === '')) {
      this.notify.failNotification('Please fill in all intern codes');
      return;
    }
    if (new Set(indexNumbers.map(registration => registration.intern_code)).size !== indexNumbers.length) {
      this.notify.failNotification('Intern codes must be unique');
      return;
    }
    if (indexNumbers.some(registration => registration.exam_id.trim() === '')) {
      this.notify.failNotification('Exam ID must be provided');
      return;
    }
    if (!window.confirm('Are you sure you want to assign these index numbers?')) {
      return;
    }
    this.service.addExamRegistrations(indexNumbers).subscribe({
      next: () => {
        this.notify.successNotification('Index numbers assigned successfully');
        indexNumbers = [];
      },
      error: () => {
        this.notify.failNotification('Failed to assign index numbers');
      }
    });
    this.dialogRef.close(true);
  }
}
