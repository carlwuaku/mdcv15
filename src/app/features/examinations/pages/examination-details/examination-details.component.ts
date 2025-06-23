import { Component, OnInit } from '@angular/core';
import { ExaminationObject } from '../../models/examination.model';
import { ExaminationService } from '../../examination.service';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { ExaminationRegistrationObject } from '../../models/examination-registration.model';

@Component({
  selector: 'app-examination-details',
  templateUrl: './examination-details.component.html',
  styleUrls: ['./examination-details.component.scss']
})
export class ExaminationDetailsComponent implements OnInit {

  id: string | undefined = undefined;

  can_edit: boolean = false;
  can_delete: boolean = true;

  object: ExaminationObject | null = null;
  isLoading: boolean = false;
  errorLoadingData: boolean = false;
  displayedColumns: string[] = []
  headerTabs: { label: string, key: string }[] = [];

  resultNotSetCount: number = 0;
  failedCount: number = 0;
  passedCount: number = 0;
  totalCount: number = 0;

  constructor(private service: ExaminationService, private notify: NotifyService,
    ar: ActivatedRoute) {
    this.id = ar.snapshot.params['id'];

  }

  ngOnInit() {
    this.getExamDetails();

  }

  getExamDetails() {
    //load the cpd details and then attendees
    this.isLoading = true;
    this.errorLoadingData = false;
    this.service.getExamDetails(this.id!).subscribe({
      next: data => {
        this.object = data.data;
        this.isLoading = false;
        this.errorLoadingData = false;
        this.headerTabs = [
          { label: "Exam type", key: this.object.exam_type || "" },
          { label: "Practitioner type", key: this.object.type || "" },
          { label: "open from", key: this.object.open_from || "" },
          { label: "Open to", key: this.object.open_to || "" }]
        this.getExamResultCounts(data.data.id);
      },
      error: error => {
        this.isLoading = false;
        this.errorLoadingData = true;
      }
    });
  }

  getExamResultCounts(id: string) {
    this.service.getExaminationResultCounts(id).subscribe({
      next: data => {
        this.resultNotSetCount = data.not_set || 0;
        this.failedCount = data.fail || 0;
        this.passedCount = data.pass || 0;
        this.totalCount = this.resultNotSetCount + this.failedCount + this.passedCount;
        // this.getAttendees();
      },
      error: error => {
        this.isLoading = false;
        this.errorLoadingData = true;
      }
    });
  }

  registrationAdded(objects: ExaminationRegistrationObject[]) {
    this.getExamResultCounts(this.object!.id);
  }

  registrationDeleted() {
    this.getExamResultCounts(this.object!.id);
  }

  resultChanged() {
    this.getExamResultCounts(this.object!.id);
  }
}
