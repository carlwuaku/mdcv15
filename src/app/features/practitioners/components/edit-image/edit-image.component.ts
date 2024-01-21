import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PractitionerObject } from "../../models/practitioner_model";

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.scss']
})
export class EditImageComponent {
  constructor(
    public dialogRef: MatDialogRef<EditImageComponent>,
    @Inject(MAT_DIALOG_DATA) public practitioner: PractitionerObject) {

    }

    closeDialog(): void {
      this.dialogRef.close();
  }
}
