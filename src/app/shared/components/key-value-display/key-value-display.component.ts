import { Component, Input, OnInit } from '@angular/core';
import { getLabelFromKey } from '../../utils/helper';

@Component({
  selector: 'app-key-value-display',
  templateUrl: './key-value-display.component.html',
  styleUrls: ['./key-value-display.component.scss']
})
export class KeyValueDisplayComponent implements OnInit{
  @Input() object: any = null;
  @Input() displayedColumns:string[] = [];
  @Input() columnLabels?:{ [key: string]: string } = {};
  finalList:{key:string, value:any}[] = []
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
}
