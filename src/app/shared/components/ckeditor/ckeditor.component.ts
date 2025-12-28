import { Component, EventEmitter, Input, Output } from '@angular/core';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { EditorConfig } from '@ckeditor/ckeditor5-core';
import { MatDialog } from '@angular/material/dialog';
import { MediaSelectorComponent } from '../media-selector/media-selector.component';

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

  private editorInstance: any;

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

  constructor(private dialog: MatDialog) {}

  onReady(editor: any) {
    this.editorInstance = editor;
    editor.editing.view.change((writer: any) => {
      writer.setStyle('height', '300px', editor.editing.view.document.getRoot());
    });
  }

  valueChanged() {
    this.valueChange.emit(this.value);
  }

  /**
   * Open media library selector and insert selected image into editor
   */
  openMediaLibrary() {
    const dialogRef = this.dialog.open(MediaSelectorComponent, {
      width: '900px',
      data: {
        title: 'Select Image from Media Library',
        allowedTypes: ['image/'],
        multiple: false
      }
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result && this.editorInstance) {
        // Insert image at current cursor position
        const viewFragment = this.editorInstance.data.processor.toView(`<img src="${result}" alt="Media Library Image" />`);
        const modelFragment = this.editorInstance.data.toModel(viewFragment);
        this.editorInstance.model.insertContent(modelFragment);
      }
    });
  }
}
