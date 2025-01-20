import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from "src/app/core/services/http/http.service";
import { NotifyService } from "src/app/core/services/notify/notify.service";
import { take } from "rxjs";
import { FileUploadResponse, FileUploadService } from "src/app/core/services/http/file-upload.service";

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.scss']
})
export class EditImageComponent {
  images = new Map<string, File>();
  updateUrl: string = '';
  constructor(
    public dialogRef: MatDialogRef<EditImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { uuid: string, picture: string, name: string, unique_id: string, updateUrl: string },
    private dbService: HttpService,
    private notify: NotifyService,
    private fileUploadService: FileUploadService
  ) {

  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  onFileSelected(files: File[]) {
    if (files.length > 0) {
      this.images.set("Image", files[0]);
    }
  }

  public uploadFiles() {
    if (this.images.size === 0) {
      alert('Please select an image to upload');
      return;
    }
    //the file must be a valid image type
    const file = this.images.get("Image");
    if (!file) {
      alert('Please select an image to upload');
      return;
    }


    const uploadUrl = 'file-server/new/practitioners_images';
    this.fileUploadService.uploadFiles(this.images, uploadUrl)
      .subscribe({
        next: (results) => {
          // we only expect one result
          this.fileUploadComplete(results[0].response.fullPath);


        },
        error: (error) => {
          console.error('Error uploading files', error);
          // Handle errors
        }
      });
  }

  fileUploadComplete(filePath: string) {
    this.notify.showLoading();
    const data = new FormData();
    data.append("picture", filePath)
    data.append("uuid", this.data.uuid);
    this.dbService.put<any>(`${this.data.updateUrl}/${this.data.uuid}`, data).pipe(take(1)).subscribe({
      next: data => {
        this.notify.successNotification('Submitted successfully');
        this.images.clear();
        this.dialogRef.close(filePath)
      },
      error: error => {
        this.notify.hideLoading();
        console.log(error);

      }
    });

  }
}
