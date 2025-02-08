import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ProgressItem {
  title: string;
  progress: number;
}
@Component({
    selector: 'app-progress-dialog',
    templateUrl: './progress-dialog.component.html',
    styleUrls: ['./progress-dialog.component.scss'],
    standalone: false
})
export class ProgressDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      progressItems: ProgressItem[];
      disableCancel?: boolean;
    }
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }
}
