import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { API_INTERN_PATH } from 'src/app/shared/utils/constants';
import { menuItems, DashboardItem } from 'src/app/shared/utils/data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy, OnInit {
  menuItems: DashboardItem[] = []// dashboardItems
  destroy$: Subject<boolean> = new Subject();
  constructor(private appService: AppService) {

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.appService.appSettings.pipe(takeUntil(this.destroy$)).subscribe(data => {
      console.log(data.dashboardMenu);
      this.menuItems = data.dashboardMenu;
    });
  }
}
