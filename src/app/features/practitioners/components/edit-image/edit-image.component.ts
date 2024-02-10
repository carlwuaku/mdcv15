import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PractitionerObject } from "../../models/practitioner_model";
import { HttpService } from "src/app/core/services/http/http.service";
import { NotifyService } from "src/app/core/services/notify/notify.service";
import { take } from "rxjs";

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.scss']
})
export class EditImageComponent {
  constructor(
    public dialogRef: MatDialogRef<EditImageComponent>,
    @Inject(MAT_DIALOG_DATA) public practitioner: PractitionerObject,
    private dbService: HttpService,
    private notify: NotifyService
    ) {

    }

    closeDialog(): void {
      this.dialogRef.close(false);
  }

  fileUploadComplete(filePath:string){
    console.log(filePath);
    this.notify.showLoading();
    const data = new FormData();
    data.append("picture", filePath)
    data.append("uuid", this.practitioner.uuid);
    this.dbService.put<any>(`practitioners/details/${this.practitioner.uuid}`, data).pipe(take(1)).subscribe({
      next: data => {
        this.notify.successNotification('Submitted successfully');
        this.dialogRef.close(filePath)
      },
      error: error => {
        this.notify.hideLoading();
        console.log(error);

      }
    });

  }
}
