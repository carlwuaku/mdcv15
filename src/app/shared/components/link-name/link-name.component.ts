import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'app-link-name',
    templateUrl: './link-name.component.html',
    styleUrls: ['./link-name.component.scss'],
    standalone: false
})
export class LinkNameComponent {
  params:any;
  label!: string;
  
  link!: string;
  agInit(params:any): void {
    this.params = params;
    this.link = params.link;
    this.label = params.label;
  }



  ngOnDestroy() {
    // console.log(`Destroying LinkName Component`);
  }

  refresh(): boolean {
    return false;
  }
}
