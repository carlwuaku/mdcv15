import { Component } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MenuItem, menuItems } from '../../utils/data';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})


export class SidebarComponent {
  current_url: string = "/dashboard";

  menuItems: MenuItem[] = menuItems

  treeControl = new NestedTreeControl<MenuItem>(node => node.children);
  dataSource = new MatTreeNestedDataSource<MenuItem>();

  constructor() {
    this.dataSource.data = this.menuItems;
  }

  hasChild = (_: number, node: MenuItem) => !!node.children && node.children.length > 0;
}
