import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-inline-editor',
  templateUrl: './inline-editor.component.html',
  styleUrls: ['./inline-editor.component.scss']
})
export class InlineEditorComponent {
  @Input() text: any;
  @Output() valueChanged: EventEmitter<any> = new EventEmitter();

  editMode: boolean = false;
  newText: string = "";

  startEdit() {
    this.newText = this.text;
    this.editMode = true;
  }

  cancel() {
    this.editMode = false;
  }

  save() {
    this.text = this.newText;
    this.editMode = false;
    this.valueChanged.emit(this.newText)
  }
}
