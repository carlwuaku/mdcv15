import { Component, Input } from '@angular/core';
import { isObject } from '../../utils/helper';

@Component({
  selector: 'app-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss']
})
export class JsonEditorComponent {
  isObject = isObject;
  @Input() jsonObject: {[key:string]:any} = {};

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }



  setPropertyValue(key:string, value: any){
    this.jsonObject[key] = value;
  }

  setPropertyText(key:string, newKey:any){
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
