import { Component } from '@angular/core';

@Component({
    selector: 'app-data-list-menu-button',
    templateUrl: './data-list-menu-button.component.html',
    styleUrls: ['./data-list-menu-button.component.scss'],
    standalone: false
})
export class DataListMenuButtonComponent {
  params: any;

  actions!: {
    label: string,
    onClick: Function,
    icon?: string,
    type: "button" | "link",
    link?:string
  }[];
  agInit(params: any): void {
    this.params = params;


    this.actions = params.actions;

    
  }



  ngOnDestroy() {
  }

  refresh(): boolean {
    return false;
  }

  onClick($event: any) {
    if (this.params.onClick instanceof Function) {
      const params = this.params.node.data;
      this.params.onClick(params);

    }
  }
}
