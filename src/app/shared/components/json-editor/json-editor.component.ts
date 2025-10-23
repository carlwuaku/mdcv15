import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { isObject } from '../../utils/helper';

@Component({
  selector: 'app-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss']
})
export class JsonEditorComponent implements OnChanges {
  isObject = isObject;
  @Input() jsonObject: { [key: string]: any } = {};
  @Input() initialValue: string | object = {};



  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jsonObject']) {
      this.jsonObject = changes['jsonObject'].currentValue;
    }
    if (changes['initialValue'] && changes['initialValue'].currentValue) {
      if (typeof changes['initialValue'].currentValue === 'string') {
        this.jsonObject = JSON.parse(changes['initialValue'].currentValue);
        console.log(this.jsonObject)
      }
      else {
        this.jsonObject = changes['initialValue'].currentValue;

      }
    }
  }

  setPropertyValue(key: string, value: any) {
    this.jsonObject[key] = value;
  }

  setPropertyText(key: string, newKey: any) {
    this.jsonObject[newKey] = this.jsonObject[key];
    delete this.jsonObject[key]
  }

  addProperty(key: string): void {
    // Logic to add a new property to the JSON object
  }

  editValue(key: string): void {
    // Logic to edit the value of a property in the JSON object
  }
}
