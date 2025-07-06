import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { ExaminationPublishResultObject, ExaminationRegistrationObject } from '../../models/examination-registration.model';
import { MatDialog } from '@angular/material/dialog';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { ExaminationService } from '../../examination.service';

@Component({
  selector: 'app-manage-publish-result',
  templateUrl: './manage-publish-result.component.html',
  styleUrls: ['./manage-publish-result.component.scss']
})
export class ManagePublishResultComponent {
  @Input() registrations: ExaminationRegistrationObject[] = [];
  publishDate: string = '';
  @ViewChild('dialog') dateDialog!: TemplateRef<any>;
  @Output() resultPublished = new EventEmitter();

  constructor(private dialog: MatDialog, private service: ExaminationService, private notify: NotifyService) { }

  publishResult() {
    if (!window.confirm('Are you sure you want to publish results?')) return;
    if (!this.publishDate) {
      this.notify.failNotification('Please select a date');
      return;
    }
    this.notify.showLoading();
    const data: ExaminationPublishResultObject[] = [];
    this.registrations.forEach(reg => {
      data.push({
        uuid: reg.uuid!,
        publish_result_date: this.publishDate,
        index_number: reg.index_number,
        intern_code: reg.intern_code
      });
    })
    this.service.publishResults(data).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.resultPublished.emit();
        this.notify.hideLoading();

      },
      error: error => {
        this.notify.failNotification(error.error.message);
        this.notify.hideLoading();
      }
    });

  }

  unpublishResult() {
    if (!window.confirm('Are you sure you want to unpublish results? This will make the results unavailable to the candidates')) return;

    this.notify.showLoading();
    const data: ExaminationPublishResultObject[] = [];
    this.registrations.forEach(reg => {
      data.push({
        uuid: reg.uuid!,
        publish_result_date: "",
        index_number: reg.index_number,
        intern_code: reg.intern_code
      });
    })
    this.service.unpublishResults(data).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.resultPublished.emit();
        this.notify.hideLoading();

      },
      error: error => {
        this.notify.failNotification(error.error.message);
        this.notify.hideLoading();
      }
    });

  }



  openDialog() {
    this.dialog.open(this.dateDialog);


  }

  setAttendanceDate(date: string) {
    this.publishDate = date;
  }
}
