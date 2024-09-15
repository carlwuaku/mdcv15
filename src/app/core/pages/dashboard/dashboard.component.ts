import { Component } from '@angular/core';
import { API_INTERN_PATH } from 'src/app/shared/utils/constants';
import { dashboardItems, menuItems } from 'src/app/shared/utils/data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  menuItems = []// dashboardItems
}
