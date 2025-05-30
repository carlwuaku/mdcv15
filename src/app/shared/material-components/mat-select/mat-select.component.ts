import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getLabel } from '../../utils/helper';

@Component({
  selector: 'app-mat-select',
  templateUrl: './mat-select.component.html',
  styleUrls: ['./mat-select.component.scss']
})
export class MatSelectComponent {
  @Input() objects: any[] = []
  @Input() selectedItem: string | string[] = ""
  @Output() selectedItemChange = new EventEmitter();
  @Input() labelProperty: string = "name"; //this can be a comma-separated list of properties
  @Input() keyProperty: string = "id";
  @Input() selection_mode: "single" | "singles" | "multiple" = "single";
  @Input() fieldLabel: string = "";
  getLabel = getLabel;

  selectionMade() {
    this.selectedItemChange.emit(this.selectedItem);
  }

  getValue(object: any) {
    if (typeof object === "object") {
      if (this.keyProperty.includes(",")) {
        const labels = this.keyProperty.split(",").map((prop: string) => object[prop.trim()]).join(" ");
        return labels;
      } else {
        let value = object[this.keyProperty];
        if (value === null || value === undefined) {
          return "--Null--";
        }
        if (typeof value === "object") {
          return JSON.stringify(value);
        }
        if (typeof value === "string" && value.trim() === "") {
          return "--Empty Value--";
        }
        return value;
      }
    }
    else {
      if (object === null || object === undefined) {
        return "--Null--";
      }
      if (typeof object === "string" && object.trim() === "") {
        return "--Empty Value--";
      }
      return object;
    }
  }

  selectAll() {
    this.selectedItem = this.objects.filter(object => object[this.keyProperty]).map((object: any) => object[this.keyProperty]);
    this.selectedItemChange.emit(this.selectedItem);
  }

  clearSelection() {
    this.selectedItem = [];
    this.selectedItemChange.emit(this.selectedItem);
  }
}
