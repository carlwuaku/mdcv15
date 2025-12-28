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
  current_full_url: string = "/dashboard"; // Store full URL with query params

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
        this.current_full_url = event.url; // Store full URL with query params
        this.current_url = event.url.split('?')[0]
      }
    });
  }

  hasChild = (_: number, node: MenuItem) => !!node.children && node.children.length > 0;

  isActiveParent(menuItem: MenuItem) {
    // if any child is active, then parent is active
    return menuItem.children.some(child => this.isActiveChild(child))
  }

  isActiveChild(menuItem: MenuItem) {
    const main = menuItem.url.split('?')[0];

    // If the main URL ends with 'applications', check if form_type matches
    if (main.endsWith('applications')) {
      const urlParams = new URLSearchParams(this.current_full_url.split('?')[1]);
      const currentFormType = urlParams.get('form_type');
      const menuFormType = menuItem.urlParams?.['form_type'];

      // If menu item has a form_type, only match if it equals the current form_type
      if (menuFormType) {
        return this.current_url === main && currentFormType === menuFormType;
      }

      // If menu item has no form_type but current URL does, don't match
      if (currentFormType) {
        return false;
      }
    }

    return this.current_url === main
  }
}
