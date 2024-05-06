import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IFormGenerator, isFormField, isRow } from '../form-generator/form-generator-interface';
import { MatDialog } from '@angular/material/dialog';
import { OptionsEditorComponent } from './options-editor/options-editor.component';

@Component({
  selector: 'app-form-editor',
  templateUrl: './form-editor.component.html',
  styleUrls: ['./form-editor.component.scss']
})
export class FormEditorComponent implements OnInit{
  @Input() fields: (IFormGenerator | IFormGenerator[])[] = [];
  @Output() submitted:EventEmitter<(IFormGenerator | IFormGenerator[])[]> = new EventEmitter();
  selectedItem: IFormGenerator | undefined;
  lastSelected: IFormGenerator | undefined;// Add a property to store the last selected field so we can reset
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

  addField(type:string) {
    // Add a new IFormGenerator object to the fields array
    this.fields.push({
      label: "Default Label",
      name: "",
      hint: "",
      options: [],
      type: type,
      value: "",
      required: false,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    });
    this.selectedItem = (this.fields[this.fields.length - 1] as IFormGenerator);
  }

  addRow() {
    // Add a new row to the fields array
    this.fields.push([]);
  }

  addFieldToRow(row: IFormGenerator[], type:string) {
    // Add a new IFormGenerator object to the row array
    row.push({
      label: "Default Label",
      name: "",
      hint: "",
      options: [],
      type: type,
      value: "",
      required: false,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    });

  }

  moveRowFieldUp(row: IFormGenerator[], field: IFormGenerator) {
    // Get the index of the field
    const index = row.indexOf(field);
    // If the field is not the first field
    if (index > 0) {
      // Swap the field with the field before it
      [row[index - 1], row[index]] = [row[index], row[index - 1]];
    }
  }

  moveRowFieldDown(row: IFormGenerator[], field: IFormGenerator) {
    // Get the index of the field
    const index = row.indexOf(field);
    // If the field is not the last field
    if (index < row.length - 1) {
      // Swap the field with the field after it
      [row[index + 1], row[index]] = [row[index], row[index + 1]];
    }
  }

  deleteField(name:string) {
    // Find the index of the field with the name passed in
    const index = this.fields.findIndex((field) => isFormField(field) && field.name === name);
    // If the index is found
    if (index !== -1) {
      // Remove the field from the fields array
      this.fields.splice(index, 1);
    }
  }

  removeRow() {}

  moveFieldUp(field: IFormGenerator) {
    // Get the index of the field
    const index = this.fields.indexOf(field);
    // If the field is not the first field
    if (index > 0) {
      // Swap the field with the field before it
      [this.fields[index - 1], this.fields[index]] = [this.fields[index], this.fields[index - 1]];
    }
  }

  moveFieldDown(field: IFormGenerator) {
    // Get the index of the field
    const index = this.fields.indexOf(field);
    // If the field is not the last field
    if (index < this.fields.length - 1) {
      // Swap the field with the field after it
      [this.fields[index + 1], this.fields[index]] = [this.fields[index], this.fields[index + 1]];
    }
  }

  editField() {}

  setSelectedField(field: IFormGenerator) {
    this.selectedItem = field;
  }

  openOptionsDialog() {
    const dialogRef = this.dialog.open(OptionsEditorComponent, {
      width: '70vw',
      data: {label: this.selectedItem!.label, options: this.selectedItem!.options}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      this.selectedItem!.options = result;
    });
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
