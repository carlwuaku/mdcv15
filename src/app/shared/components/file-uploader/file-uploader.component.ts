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
  @Input() maxFileSize:number = 1_000_000
  @Input() uploadUrl:string = `${this.dbService.baseUrl}file-server/new`;
  @Input() multiple:boolean = false;
  @Input() parameter:string = "uploadFile";
  @Input() assetType:string = "practitioners_images";
  @Input() showUploadButton:boolean = true;
  @Input() showCancelButton:boolean = true;
  @Output() onUploadCompleted: EventEmitter<string> = new EventEmitter<string>();
    constructor(private dbService: HttpService) {
      this.uploadUrl = this.uploadUrl+'/'+this.assetType;
    }

    onUpload(event:UploadEvent) {
        console.log('on upload',event)
    }
    startUploads(){}

    upload(file: File){
      const data = new FormData();
      data.append("uploadFile", file)
      this.dbService.post<{filePath: string}>(this.uploadUrl, data).pipe(take(1)).subscribe({
        next: (response) => {
          console.log(response);
          this.onUploadCompleted.emit(response.filePath)
        },
        error: (error) => {

        }
      })
    }
}
