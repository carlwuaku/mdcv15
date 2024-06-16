import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { GoogleTagManagerService } from "angular-google-tag-manager";
import { AnalyticsService } from "./core/services/analytics/analytics.service";
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AuthService } from './core/auth/auth.service';
import { HttpService } from './core/services/http/http.service';
import { API_PATH } from './shared/utils/constants';
import { ActivatedRoute } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppService } from './app.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  //check the injector for ProductService when implement api call
  providers: [GoogleTagManagerService],
})
export class AppComponent implements OnInit {
  appName = 'MDC Management System';
  title = '';
  isLoggedIn: boolean;
  user = this.authService.currentUser;
  mobileQuery: MediaQueryList;


  private _mobileQueryListener: () => void;

  public opened: boolean = true;
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }


  constructor(
    private router: Router,
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    private dbService: HttpService,
    private ar: ActivatedRoute,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private appService: AppService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    //log changes in the mobilequery
    this.mobileQuery.addEventListener('change', (e) => {
      if(e.matches){
        this.opened = false;
      }else{
        this.opened = true;
      }
    });
    this.isLoggedIn = this.authService.checkLogin("")
    this.ar.data.subscribe(data => {
      this.title = data['title']
    });
    this.appService.appSettings.subscribe(data => {
      this.appName = data.appName;
    })
  }

  ngOnInit(): void {
    if(this.isLoggedIn){
      this.authService.getUser().subscribe(data => {
        console.log(data)
        this.user = data;
      });
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let root: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
        let titles = [];
        while (root) {
          if (root.data['title']) { titles.push(root.data['title']); }

          root = root.firstChild!;
        }
        this.title = titles.join('/ ');
      }
    });
  }

  logout() {
    this.authService.logout();
    //send user to login page
    window.location.assign('/');
  }
}
