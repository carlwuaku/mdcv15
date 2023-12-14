import { Component, OnDestroy } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
  selector: 'array-links',
  templateUrl: './array-links.component.html',
  styleUrls: ['./array-links.component.scss']
})
export class ArrayLinksComponent {
  params:any;

  array: any;
  agInit(params:any): void {
    this.params = params;

    this.array = this.params.node.data.attachments;
    // console.log(this.params.type, this.params.node.data)
    // $('.example-popover').popover({
    //   container: 'body'
    // })
  }



  ngOnDestroy() {
  }

  refresh(): boolean {
    return false;
  }

  onClick($event:any) {
    if (this.params.onClick instanceof Function) {
      const params = this.params.node.data;
      this.params.onClick(params);

    }
  }
}
