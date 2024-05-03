import { Component, Input, OnInit } from '@angular/core';
import { getLabelFromKey, isArray, isObject } from '../../utils/helper';

@Component({
  selector: 'app-key-value-display',
  templateUrl: './key-value-display.component.html',
  styleUrls: ['./key-value-display.component.scss']
})
export class KeyValueDisplayComponent implements OnInit{
  @Input() object: any = null;
  @Input() displayedColumns:string[] = [];
  @Input() columnLabels?:{ [key: string]: string } = {};
  finalList:{key:string, value:any}[] = [];
  isObject = isObject;
  isArray = isArray;
  ngOnInit(): void {
    this.finalList = [];
    if(this.object){
      //use the displayedColumns to get the keys, else use the present keys
      if(this.displayedColumns.length > 0){
        this.displayedColumns.forEach(key => {
          this.finalList.push({key: getLabelFromKey(key), value: this.object[key]})
        });
      }
      else{
        for (const key in this.object) {
          if (Object.prototype.hasOwnProperty.call(this.object, key)) {
            const value = this.object[key];
            this.finalList.push({key: getLabelFromKey(key), value})
          }
        }
      }

    }
  }

  /**
   * check if the value is a url, image, or a string
   * @param value string
   * @returns string
   */
  getDataType(value:any):string{
    if(typeof value === 'string'){
      if(value.startsWith('http')){
        return 'url';
      }
      if(value.startsWith('data:image')){
        return 'image';
      }
    }
    return 'string'
  }




}
