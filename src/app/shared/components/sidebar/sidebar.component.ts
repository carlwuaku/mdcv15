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
    //if the main url ends with applications, check the query params for 'form_type'. if form_type is present and matches the form_type param in the menuItem, then return true
    if (main.endsWith('applications') && menuItem.urlParams && menuItem.urlParams['form_type']) {
      const urlParams = new URLSearchParams(this.current_url.split('?')[1]);
      const formType = urlParams.get('form_type');
      if (formType && menuItem.urlParams && menuItem.urlParams['form_type']) {
        return formType === menuItem.urlParams['form_type'];
      }
    }
    return this.current_url === main
  }
}
