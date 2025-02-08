import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";
import { isArray, isObject } from '../../utils/helper';

@Component({
    selector: 'app-json-display',
    templateUrl: './json-display.component.html',
    styleUrls: ['./json-display.component.scss'],
    standalone: false
})
export class JsonDisplayComponent implements OnInit {


  @Input() value:any;
  objectType:"array"|"object"|"image"|"link"|"string" = "string";
  isObject = isObject;
  isArray = isArray;
  imageHeight = 100;
  imageWidth = "100px";
  @Input() depth = 0;




  ngOnInit(): void {
    //if the depth is greater than 3, then we should not display the object
    if(this.depth > 3){
      this.objectType = "string";
      return;
    }
    if(!this.value){
      this.objectType = "string";
    }
    if(isObject(this.value)){
      this.objectType = "object";
    }
    else if(isArray(this.value)){
      this.objectType = "array";
    }
    else if(typeof this.value === 'string'){
      if(this.value.startsWith('http')){
        //check if the link is an image
        if(this.value.endsWith('.jpg') || this.value.endsWith('.png') || this.value.endsWith('.jpeg')){
          this.objectType = "image";
        }
        else
        this.objectType = "link";
      }
      if(this.value.startsWith('data:image')){
        this.objectType = "image";
      }
    }
    else{
      this.objectType = "string";
    }
  }

}
