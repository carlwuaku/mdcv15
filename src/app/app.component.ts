import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { GoogleTagManagerService } from "angular-google-tag-manager";
import { AnalyticsService } from "./core/services/analytics/analytics.service";
import { AuthService } from './core/auth/auth.service';
import { HttpService } from './core/services/http/http.service';
import { ActivatedRoute } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppService } from './app.service';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  //check the injector for ProductService when implement api call
  providers: [GoogleTagManagerService],
  standalone: false
})
export class AppComponent implements OnInit {
  appName = 'Management System';
  title = '';
  isLoggedIn: boolean;
  user = this.authService.currentUser;
  mobileQuery: MediaQueryList;
  logo: string = "";

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
    private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher, private appService: AppService) {
    // this.mobileQuery = media.matchMedia('(max-width: 600px)');
    // this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // this.mobileQuery.addListener(this._mobileQueryListener);
    // //log changes in the mobilequery
    // this.mobileQuery.addEventListener('change', (e) => {
    //   if (e.matches) {
    //     this.opened = false;
    //   } else {
    //     this.opened = true;
    //   }
    // });
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.updateSidebarState(this.mobileQuery.matches);
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.isLoggedIn = this.authService.checkLogin("")
    this.ar.data.subscribe(data => {
      this.title = data['title']
    });
    this.appService.appSettings.subscribe(data => {
      this.appName = data.appName;
      this.logo = data.logo;
    })
  }

  ngOnInit(): void {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.changeDetectorRef.detectChanges();
    this.updateSidebarState(this.mobileQuery.matches);
    const firebaseConfig = {
      apiKey: "AIzaSyBMaXxiM-ANGciBypyPjaPqcU8qfCI19z0",
      authDomain: "mdcms-uat.firebaseapp.com",
      projectId: "mdcms-uat",
      storageBucket: "mdcms-uat.appspot.com",
      messagingSenderId: "377847874484",
      appId: "1:377847874484:web:8d40c9eb4f003fd9ed28e1",
      measurementId: "G-FC717CXV4E"
    };

    if (this.isLoggedIn) {
      this.authService.getUser().subscribe(data => {
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
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
  }

  logout() {
    this.authService.logout();
    //send user to login page
    window.location.assign('/');
  }

  private updateSidebarState(matches: boolean) {
    this.opened = !matches;
    this.changeDetectorRef.detectChanges();
  }

  goBack() {
    window.history.back();
  }

}
