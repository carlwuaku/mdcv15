import { Component, Inject, Input } from '@angular/core';
import { IFormGenerator } from '../form-generator/form-generator-interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-form',
    templateUrl: './dialog-form.component.html',
    styleUrls: ['./dialog-form.component.scss'],
    standalone: false
})
export class DialogFormComponent {
  formType:"submit"|"filter" = "submit";
  fields:IFormGenerator[] = [];
  title:string = "";

  constructor(
    public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {fields:IFormGenerator[], formType:"submit"|"filter", title:string}) {

    this.formType = data.formType;
    this.fields = data.fields;
    this.title = data.title;
     }

ngOnInit() {
}



formSubmitted(args:IFormGenerator[]): void {
    this.dialogRef.close(args);
}

}
