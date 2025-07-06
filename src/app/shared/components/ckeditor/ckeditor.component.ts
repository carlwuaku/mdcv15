import { Component, EventEmitter, Input, Output } from '@angular/core';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { EditorConfig } from '@ckeditor/ckeditor5-core';

@Component({
  selector: 'app-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss']
})
export class CkeditorComponent {
  public Editor = Editor.Editor;
  @Input() name: string = "";
  @Input() value: string = '';
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  // Configuration to preserve HTML structure and styling
  public config: EditorConfig = {
    htmlSupport: {
      allow: [
        {
          name: /.*/, // Allow all elements
          attributes: true, // Allow all attributes
          classes: true,  // Allow all classes
          styles: true   // Allow all styles
        }
      ],
      allowEmpty: ['div', 'p', 'i', 'span', 'img']
    }
  };

  onReady(editor: any) {
    editor.editing.view.change((writer: any) => {
      writer.setStyle('height', '300px', editor.editing.view.document.getRoot());
    });
  }

  valueChanged() {
    this.valueChange.emit(this.value);
  }
}
