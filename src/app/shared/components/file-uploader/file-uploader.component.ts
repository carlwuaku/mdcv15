import { HttpEvent, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { take } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss'],
    standalone: false
})
export class FileUploaderComponent implements OnChanges {
  uploadedFiles: any[] = [];
  @Input() maxFileSize: number = 5; // in MB
  @Input() uploadUrl: string = `${this.dbService.baseUrl}file-server/new`;
  @Input() multiple: boolean = false;
  @Input() parameter: string = "uploadFile";
  @Input() assetType: string = "practitioners_images";
  @Input() showUploadButton: boolean = true;
  @Input() showCancelButton: boolean = true;
  @Input() existingImage: string | null = null;
  @Input() uploadButtonLabel: string = "Confirm";
  @Input() cancelButtonLabel: string = "Cancel";
  @Input() chooseButtonLabel: string = "Select File";
  @Input() accept: string = ""
  @Input() showPreview: boolean = true;
  @Input() previewHeight: string = "100";

  // @Output() onUploadCompleted: EventEmitter<string> = new EventEmitter<string>();
  @Input() required: boolean = false;
  uploadedImage: string | undefined = undefined;
  @Input() originalImage: string | undefined = undefined;
  @Input() selectedFiles: File[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef;
  previews: { file: File, preview: string }[] = [];
  @Output() onFilesSelected: EventEmitter<File[]> = new EventEmitter<File[]>();
  constructor(private dbService: HttpService, private notifyService: NotifyService) {
    this.uploadUrl = this.uploadUrl + '/' + this.assetType;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.originalImage) {
      this.originalImage = this.existingImage?.slice()
    }

  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    Array.from(files).forEach(file => {
      if (file.size <= this.maxFileSize * 1024 * 1024) {
        this.selectedFiles.push(file);
      } else {
        this.notifyService.failNotification(`${file.name} exceeds the ${this.maxFileSize}MB limit. `);
      }
    });
    this.onFilesSelected.emit(this.selectedFiles);
    this.generatePreviews();
    this.fileInput.nativeElement.value = '';
  }

  generatePreviews(): void {
    this.previews = [];
    this.selectedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previews.push({ file, preview: e.target.result });
        };
        reader.readAsDataURL(file);
      } else {
        this.previews.push({ file, preview: this.getFileIcon(file.type) });
      }
    });
  }

  getFileIcon(fileType: string): string {
    // Add more file types and icons as needed
    switch (fileType) {
      case 'application/pdf':
        return 'assets/images/pdf.png';
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'assets/images/docx.png';
      default:
        return 'assets/images/document.png';
    }
  }

  // public onUpload(event: { originalEvent: HttpResponse<{ filePath: string, fullPath:string }> }) {
  //   this.uploadedImage = event.originalEvent.body?.fullPath
  //   this.onUploadCompleted.emit(event.originalEvent.body?.fullPath)
  // }

  public remove(file: File) {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
    this.generatePreviews();
  }

}
