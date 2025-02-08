import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogFormComponent } from '../dialog-form/dialog-form.component';
import { IFormGenerator } from '../form-generator/form-generator-interface';

@Component({
    selector: 'app-dialog-key-value-display',
    templateUrl: './dialog-key-value-display.component.html',
    styleUrls: ['./dialog-key-value-display.component.scss'],
    standalone: false
})
export class DialogKeyValueDisplayComponent {
  object: {[key:string]:any} = {};
  title:string = "";
  constructor(public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {object:{[key:string]:any}, title:string}) {

    this.object = data.object;
    this.title = data.title;
    }


}
