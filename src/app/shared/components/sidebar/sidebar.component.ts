import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MenuItem, menuItems } from '../../utils/data';
import { AppService } from 'src/app/app.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})


export class SidebarComponent implements OnInit {
  current_url: string = "/dashboard";

  menuItems: MenuItem[] = []

  treeControl = new NestedTreeControl<MenuItem>(node => node.children);
  dataSource = new MatTreeNestedDataSource<MenuItem>();

  constructor(private appService: AppService, private router: Router) {
    this.dataSource.data = this.menuItems;
    this.appService.appSettings.subscribe(data => {
      this.menuItems = data.sidebarMenu
    })
  }
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.current_url = event.url
      }
    });
  }

  hasChild = (_: number, node: MenuItem) => !!node.children && node.children.length > 0;

  isActiveParent(menuItem: MenuItem) {
    // if any child is active, then parent is active
    return menuItem.children.some(child => this.isActiveChild(child))
  }

  isActiveChild(menuItem: MenuItem) {
    return this.current_url === menuItem.url.split('?')[0]
  }
}
