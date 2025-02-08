import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-options-editor',
    templateUrl: './options-editor.component.html',
    styleUrls: ['./options-editor.component.scss'],
    standalone: false
})
export class OptionsEditorComponent {
  newkey:string = "";
  newValue:string = "";
  constructor(
    public dialogRef: MatDialogRef<OptionsEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{label:string, options: {key: string, value: string}[]},
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.data.options);
  }

  addOption() {
    this.data.options.push({key: this.newkey, value: this.newValue});
    this.newkey = "";
    this.newValue = "";
  }
}
