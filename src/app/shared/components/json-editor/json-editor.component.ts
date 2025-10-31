import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { isObject } from '../../utils/helper';

@Component({
  selector: 'app-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
    // Generate a unique property name
    let newKey = 'newProperty';
    let counter = 1;
    while (this.jsonObject.hasOwnProperty(newKey)) {
      newKey = `newProperty${counter}`;
      counter++;
    }
    // Add the new property with an empty string value
    this.jsonObject[newKey] = '';
  }

  editValue(key: string): void {
    // Trigger edit mode for the specified property
    // The actual editing is handled by the inline-editor component
    // This method can be used for additional logic like validation or logging
    console.log(`Editing value for key: ${key}`);
  }
}
