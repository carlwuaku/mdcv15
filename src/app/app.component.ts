import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GoogleTagManagerService } from "angular-google-tag-manager";
import { AnalyticsService } from "./core/services/analytics/analytics.service";
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AuthService } from './core/auth/auth.service';
import { HttpService } from './core/services/http/http.service';
import { API_PATH } from './shared/utils/constants';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  //check the injector for ProductService when implement api call
  providers: [GoogleTagManagerService],
})
export class AppComponent implements OnInit {
  title = 'MDC Management System';
  isLoggedIn: boolean;
  constructor(
    private router: Router,
    private analyticsService: AnalyticsService,
  private authService: AuthService,
  private dbService: HttpService,
  private ar: ActivatedRoute) {
    this.isLoggedIn = this.authService.checkLogin("")
    this.ar.data.subscribe(data => {
      console.log(data['title']); // Logs 'some title'
      this.title = data['title']
    });
  }

  ngOnInit(): void {
    this.dbService.get<{data: string}>(API_PATH+'/app-name').subscribe({
      next :(response) =>{
        this.title = response.data
      },
      error(err) {
        console.log(err)
      },
    })
    // this.analyticsService.startGoogleAnalytics();

    // this.router.events.subscribe((item) => {
    //   if (item instanceof NavigationEnd) {
    //     const gtmTag = { event: 'page', pageName: item.url };
    //     this.gtmService.pushTag(gtmTag).then(() => { }).catch(error => { });
    //   }
    // });
    // this.analyticsService.trackPages(this.router);
  }

}
