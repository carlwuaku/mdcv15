import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { ExaminationService } from '../../examination.service';
import { ExaminationObject } from '../../models/examination.model';

@Component({
  selector: 'app-upload-results-from-csv',
  templateUrl: './upload-results-from-csv.component.html',
  styleUrls: ['./upload-results-from-csv.component.scss']
})
export class UploadResultsFromCsvComponent {
  scoreFields: string[] = [];
  constructor(public dialogRef: MatDialogRef<UploadResultsFromCsvComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: { examination: ExaminationObject },
    private service: ExaminationService, private notify: NotifyService) {
    this.scoreFields = dialogData.examination.scores_names || [];
  }

  onFileSelected(files: File[]) {
    if (files.length > 0) {
      this.service.uploadResultsFromCSV(this.dialogData.examination.id!, files[0]).subscribe(res => {
        this.notify.successNotification(res.message);
        this.dialogRef.close(res.data);
      });
    }
  }
}
