import { Component } from '@angular/core';
import { ExaminationObject } from '../../models/examination.model';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { ExaminationService } from '../../examination.service';
import { ExaminationRegistrationObject } from '../../models/examination-registration.model';
import { take } from 'rxjs';
import { printElement, sortObjectsByField } from 'src/app/shared/utils/helper';

@Component({
  selector: 'app-exam-attendance',
  templateUrl: './exam-attendance.component.html',
  styleUrls: ['./exam-attendance.component.scss']
})
export class ExamAttendanceComponent {
  id: string | undefined = undefined;
  objects: ExaminationRegistrationObject[] = [];
  isLoading: boolean = false;
  errorLoadingData: boolean = false;
  displayedColumns: string[] = []
  type: string = "Signature Table"

  sort = ['index_number', 'last_name', 'first_name'];
  sortOrder = "asc"
  sortBy = "index_number";

  constructor(private service: ExaminationService, private notify: NotifyService,
    ar: ActivatedRoute) {
    this.id = ar.snapshot.params['id'];

  }

  ngOnInit() {
    if (this.id)
      this.getRegistrations(this.id);
  }

  getRegistrations(id: string) {
    this.isLoading = true;
    this.errorLoadingData = false;
    this.service.getExaminationRegistrationsList(`exam_id=${id}&sortBy=index_number&sortOrder=asc&page=0&limit=1000`).pipe(take(1)).subscribe({
      next: data => {
        this.objects = data.data;
        this.isLoading = false;
        this.errorLoadingData = false;
      },
      error: error => {
        this.isLoading = false;
        this.errorLoadingData = true;
      }
    });
  }

  changeSort() {
    this.objects = sortObjectsByField(this.sortBy, this.sortOrder, this.objects);
  }

  print() {
    printElement('candidates-list');
  }
}
