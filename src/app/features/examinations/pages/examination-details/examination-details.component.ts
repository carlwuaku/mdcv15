import { Component, OnInit } from '@angular/core';
import { ExaminationObject } from '../../models/examination.model';
import { ExaminationService } from '../../examination.service';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from 'src/app/core/services/notify/notify.service';

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
        this.object = data;
        this.isLoading = false;
        this.errorLoadingData = false;
        this.headerTabs = [
          { label: "Exam type", key: this.object.exam_type || "" },
          { label: "Practitioner type", key: this.object.type || "" },
          { label: "open from", key: this.object.open_from || "" },
          { label: "Open to", key: this.object.open_to || "" }]
        // this.getAttendees();
      },
      error: error => {
        this.isLoading = false;
        this.errorLoadingData = true;
      }
    });
  }
}
