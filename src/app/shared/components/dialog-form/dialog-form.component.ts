import { Component, Inject, Input } from '@angular/core';
import { IFormGenerator } from '../form-generator/form-generator-interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss']
})
export class DialogFormComponent {
  formType: "submit" | "filter" = "submit";
  fields: IFormGenerator[] = [];
  title: string = "";
  url: string = "";
  id: string = "";
  constructor(
    public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { fields: IFormGenerator[], formType: "submit" | "filter", title: string, url?: string, id?: string }) {

    this.formType = data.formType;
    this.fields = data.fields;
    this.title = data.title;
    this.url = data.url || "";
    this.id = data.id || "";
  }

  ngOnInit() {
  }



  formSubmitted(args: IFormGenerator[]): void {
    this.dialogRef.close(args);
  }

}
