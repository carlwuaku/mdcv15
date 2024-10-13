import { Component } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MenuItem, menuItems } from '../../utils/data';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})


export class SidebarComponent {
  current_url: string = "/dashboard";

  menuItems: MenuItem[] = []

  treeControl = new NestedTreeControl<MenuItem>(node => node.children);
  dataSource = new MatTreeNestedDataSource<MenuItem>();

  constructor(private appService: AppService) {
    this.dataSource.data = this.menuItems;
    this.appService.appSettings.subscribe(data => {
      this.menuItems = data.sidebarMenu
    })
  }

  hasChild = (_: number, node: MenuItem) => !!node.children && node.children.length > 0;
}
