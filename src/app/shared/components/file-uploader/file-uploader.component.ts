import { HttpEvent, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { take } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent {
  uploadedFiles: any[] = [];
  @Input() maxFileSize: number = 1_000_000
  @Input() uploadUrl: string = `${this.dbService.baseUrl}file-server/new`;
  @Input() multiple: boolean = false;
  @Input() parameter: string = "uploadFile";
  @Input() assetType: string = "practitioners_images";
  @Input() showUploadButton: boolean = true;
  @Input() showCancelButton: boolean = true;
  @Input() existingImage: string | null = null;
  @Input() uploadButtonLabel:string = "Confirm";
  @Input() cancelButtonLabel:string = "Cancel";
  @Input() chooseButtonLabel: string = "Select File";

  @Output() onUploadCompleted: EventEmitter<string> = new EventEmitter<string>();
  @Input() required: boolean = false;
  constructor(private dbService: HttpService) {
    this.uploadUrl = this.uploadUrl + '/' + this.assetType;
  }

  public onUpload(event: { originalEvent: HttpResponse<{ filePath: string }> }) {
    this.onUploadCompleted.emit(event.originalEvent.body?.filePath)
  }

}
