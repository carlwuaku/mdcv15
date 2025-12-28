import { Component, Inject, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, take } from 'rxjs';
import { Template } from 'src/app/shared/components/print-table/Template.model';
import { ExaminationRegistrationObject, ExaminationResultObject } from '../../models/examination-registration.model';
import { ExaminationService } from '../../examination.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { MatTableDataSource } from '@angular/material/table';
import { EditableColumn } from 'src/app/shared/components/table/table.component';
import { ExaminationObject } from '../../models/examination.model';
import { isArray } from 'src/app/shared/utils/helper';

@Component({
  selector: 'app-set-results-dialog',
  templateUrl: './set-results-dialog.component.html',
  styleUrls: ['./set-results-dialog.component.scss']
})
export class SetResultsDialogComponent implements OnInit {
  registrations: ExaminationRegistrationObject[] = [];
  results: ExaminationResultObject[] = [];
  tableDataSource: MatTableDataSource<ExaminationResultObject> = new MatTableDataSource<ExaminationResultObject>([]);
  displayedColumns: string[] = [];
  columnLabels: { [key: string]: string } = {
    license_number: 'Intern Code',
  }
  validResults = ['Pass', 'Fail', 'Absent', 'Deferred', 'Cancelled'];
  editableColumns: EditableColumn[] = [
    { field: 'result', type: 'select', options: this.validResults.map(result => ({ value: result, label: result })), validator: (value) => value.length > 0 }
  ];


  scoreFields: string[] = [];
  @Input() examination: ExaminationObject | null = null;

  constructor(public dialogRef: MatDialogRef<SetResultsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: { registrations: ExaminationRegistrationObject[], examination: ExaminationObject },
    private service: ExaminationService, private notify: NotifyService) {
    this.registrations = dialogData.registrations;
    this.examination = dialogData.examination;

  }
  ngOnInit(): void {


    this.results = this.registrations.map(candidate => {
      return {
        index_number: candidate.index_number,
        first_name: candidate.first_name!,
        last_name: candidate.last_name!,
        middle_name: candidate.middle_name!,
        result: candidate.result || '',
        uuid: candidate.uuid!,
        intern_code: candidate.intern_code,
        scores: candidate.scores || []
      };
    });
    this.scoreFields = [];
    //insert the score fields into the displayed columns
    this.displayedColumns = ["index_number"];
    if (this.examination && this.examination.scores_names && isArray(this.examination.scores_names)) {
      this.examination.scores_names.forEach(score => {
        this.displayedColumns.push(score);
        this.results.map(result => result[score] = result.scores.find(candidateScore => candidateScore.title === score)?.score || '');
        this.editableColumns.push({ field: score, type: 'text', validator: (value) => value.length > 0 });
        this.scoreFields.push(score);
      });

    }
    this.displayedColumns.push("result");
    this.tableDataSource = new MatTableDataSource<ExaminationResultObject>(this.results);
  }

  submitResults() {
    if (!window.confirm("Are you sure you want to submit the results?")) {
      return;
    }
    //validate the results
    for (let i = 0; i < this.results.length; i++) {
      const row = this.results[i];
      if (!row.result) {
        this.notify.failNotification(`Please enter a result for ${row.index_number}`);
        return;
      }
      if (this.validResults.indexOf(row.result) === -1) {
        this.notify.failNotification(`Please enter a valid result for ${row.index_number}`);
        return;
      }
    }
    //set the scores as an array of {title, score} objects
    this.results.forEach(result => {
      result.scores = this.scoreFields.map(score => {
        return { title: score, score: result[score] };
      });
    });
    console.log(this.results);
    this.service.setResults(this.results).pipe(take(1)).subscribe({
      next: (response) => {
        this.notify.successNotification(response.message);
        this.dialogRef.close(true);
      },
      error: error => {
        this.notify.failNotification(error.error.message);
      }
    })
  }
}
