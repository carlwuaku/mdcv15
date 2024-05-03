import { Component, EventEmitter, Input, Output } from '@angular/core';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

@Component({
  selector: 'app-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss']
})
export class CkeditorComponent {
  public Editor = Editor.Editor;
  @Input() name:string = "";
  @Input() value: string = '';
  @Output() valueChange:EventEmitter<string> = new EventEmitter<string>();

  valueChanged(){
    this.valueChange.emit(this.value);
  }
}
