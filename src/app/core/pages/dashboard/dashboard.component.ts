import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { API_INTERN_PATH } from 'src/app/shared/utils/constants';
import { menuItems, DashboardItem } from 'src/app/shared/utils/data';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy, OnInit {
  menuItems: DashboardItem[] = []// dashboardItems
  destroy$: Subject<boolean> = new Subject();
  user: User | null = null;
  constructor(private appService: AppService, private authService: AuthService) {

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.appService.appSettings.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.menuItems = data.dashboardMenu;
    });
    this.authService.getUser().pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.user = data;
    });
  }
}
