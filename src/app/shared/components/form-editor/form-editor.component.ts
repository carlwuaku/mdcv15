import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormField, IFormGenerator, isFormField, isRow } from '../form-generator/form-generator-interface';
import { MatDialog } from '@angular/material/dialog';
import { OptionsEditorComponent } from './options-editor/options-editor.component';

@Component({
  selector: 'app-form-editor',
  templateUrl: './form-editor.component.html',
  styleUrls: ['./form-editor.component.scss']
})
export class FormEditorComponent implements OnInit {
  @Input() fields: (FormField | FormField[])[] = [];
  @Output() formChanged: EventEmitter<(FormField | FormField[])[]> = new EventEmitter();
  selectedItem: FormField | undefined;
  lastSelected: FormField | undefined;// Add a property to store the last selected field so we can reset
  isRow = isRow;
  isFormField = isFormField
  inputTypes = [
    "text",
    "email",
    "password",
    "number",
    "date",
    "time",
    "tel",
    "url",
    "checkbox",
    "radio",
    "select",
    "textarea",
    "file",
    "label",
    "button",
    "submit",
    "reset",
    "hidden",
    "html",
    "json",
    "api"
  ]
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }



  addField(type: string) {
    // Add a new IFormGenerator object to the fields array
    this.fields.push({
      label: `Field ${this.fields.length + 1}`,
      name: "",
      hint: "",
      options: [],
      type: type,
      value: "",
      required: false,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
      showOnly: false,
    });
    this.selectedItem = (this.fields[this.fields.length - 1] as IFormGenerator);
    if (type === "checkbox" || type === "radio" || type === "select") {
      this.openOptionsDialog();
    }
    this.formChanged.emit(this.fields);
  }

  addRow() {
    // Add a new row to the fields array
    this.fields.push([]);
    this.formChanged.emit(this.fields);
  }

  addFieldToRow(row: FormField[], type: string) {
    // Add a new IFormGenerator object to the row array
    row.push(new FormField(type));
    this.selectedItem = row[row.length - 1];
    this.formChanged.emit(this.fields);
  }

  moveRowFieldUp(row: FormField[], field: FormField) {
    // Get the index of the field
    const index = row.indexOf(field);
    // If the field is not the first field
    if (index > 0) {
      // Swap the field with the field before it
      [row[index - 1], row[index]] = [row[index], row[index - 1]];
    }
    this.formChanged.emit(this.fields);
  }

  moveRowFieldDown(row: FormField[], field: FormField) {
    // Get the index of the field
    const index = row.indexOf(field);
    // If the field is not the last field
    if (index < row.length - 1) {
      // Swap the field with the field after it
      [row[index + 1], row[index]] = [row[index], row[index + 1]];
    }
    this.formChanged.emit(this.fields);
  }

  deleteField(name: string) {
    // Find the index of the field with the name passed in
    const index = this.fields.findIndex((field) => isFormField(field) && field.name === name);
    // If the index is found
    if (index !== -1) {
      // Remove the field from the fields array
      this.fields.splice(index, 1);
    }
    this.formChanged.emit(this.fields);
  }



  moveFieldUp(field: FormField) {
    // Get the index of the field
    const index = this.fields.indexOf(field);
    // If the field is not the first field
    if (index > 0) {
      // Swap the field with the field before it
      [this.fields[index - 1], this.fields[index]] = [this.fields[index], this.fields[index - 1]];
    }
    this.formChanged.emit(this.fields);
  }

  moveFieldDown(field: FormField) {
    // Get the index of the field
    const index = this.fields.indexOf(field);
    // If the field is not the last field
    if (index < this.fields.length - 1) {
      // Swap the field with the field after it
      [this.fields[index + 1], this.fields[index]] = [this.fields[index], this.fields[index + 1]];
    }
    this.formChanged.emit(this.fields);
  }

  deleteRow(field: FormField[]) {
    // Find the index of the field with the name passed in
    const index = this.fields.indexOf(field);
    if (!window.confirm("Are you sure you want to delete this row?")) {
      return;
    }
    // If the index is found
    if (index !== -1) {
      // Remove the field from the fields array
      this.fields.splice(index, 1);
    }
    this.formChanged.emit(this.fields);
  }



  moveRowUp(field: FormField[]) {
    // Get the index of the field
    const index = this.fields.indexOf(field);
    // If the field is not the first field
    if (index > 0) {
      // Swap the field with the field before it
      [this.fields[index - 1], this.fields[index]] = [this.fields[index], this.fields[index - 1]];
    }
    this.formChanged.emit(this.fields);
  }

  moveRowDown(field: FormField[]) {
    // Get the index of the field
    const index = this.fields.indexOf(field);
    // If the field is not the last field
    if (index < this.fields.length - 1) {
      // Swap the field with the field after it
      [this.fields[index + 1], this.fields[index]] = [this.fields[index], this.fields[index + 1]];
    }
    this.formChanged.emit(this.fields);
  }

  editField() { }

  setSelectedField(field: FormField) {
    this.selectedItem = field;
  }

  openOptionsDialog() {
    const dialogRef = this.dialog.open(OptionsEditorComponent, {
      width: '70vw',
      data: { label: this.selectedItem!.label, options: this.selectedItem!.options }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.selectedItem!.options = result;
      this.formChanged.emit(this.fields);
    });
  }

  setSelectedItemLabel(args: string) {
    if (this.selectedItem) {
      this.selectedItem.label = args;
      this.autoGenerateName();
    }
  }

  autoGenerateName() {
    if (this.selectedItem && this.selectedItem.label && this.selectedItem.name.trim() === "") {
      this.selectedItem.name = this.selectedItem.label.toLowerCase().replace(/ /g, "_");
    }
  }


  // saveField() {
  //   // Find the index of the selected field
  //   const index = this.fields.findIndex((field) => field === this.selectedItem);
  //   // If the index is found
  //   if (index !== -1) {
  //     // Replace the field in the fields array with the selected field
  //     this.fields[index] = this.selectedItem;
  //   }
  // }
}
