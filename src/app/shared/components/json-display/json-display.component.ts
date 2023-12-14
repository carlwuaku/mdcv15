import { Component, OnDestroy } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
  selector: 'json-display',
  templateUrl: './json-display.component.html',
  styleUrls: ['./json-display.component.scss']
})
export class JsonDisplayComponent {
  params:any;
  objects: any;
  field!:string;
  value:any;
  type!:string
  agInit(params:any): void {
    this.params = params;
    this.field = this.params.node.data.field;
    this.type = params.type
    switch (params.type) {
      case "old_value":
        this.value = this.params.node.data.old_value;
        break;
      case "custom":
        this.value = this.params.node.data.picture;
        break;
      default:
        this.value = this.params.node.data.value;
    }

    // console.log(this.params.type, this.params.node.data)
  }



  ngOnDestroy() {
    console.log(`Destroying LinkName Component`);
  }

  refresh(): boolean {
    return false;
  }

  onClick($event:any) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      }
      this.params.onClick(params);

    }
  }
}
