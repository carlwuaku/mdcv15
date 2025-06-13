import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-uploadable-ckeditor-input',
  templateUrl: './uploadable-ckeditor-input.component.html',
  styleUrls: ['./uploadable-ckeditor-input.component.scss']
})
export class UploadableCkeditorInputComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Input() value: string = '';
  @Input() name: string = '';
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private service: SharedService) { }
  uploadDocx(event: any) {
    //if there's a content already, warn the user that it will be overwritten
    if (this.value) {
      if (!window.confirm("This will overwrite the existing content.")) {
        return;
      }
    }
    const file = event.target.files[0];
    this.service.uploadDocx(file).subscribe((res) => {
      //set the template_content to the response
      this.value = res.data;
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  setContent(event: any) {
    this.value = event;
    this.valueChange.emit(this.value);
  }

}
