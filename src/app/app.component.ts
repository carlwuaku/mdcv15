import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GoogleTagManagerService } from "angular-google-tag-manager";
import { AnalyticsService } from "./core/services/analytics/analytics.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  //check the injector for ProductService when implement api call
  providers: [GoogleTagManagerService],
})
export class AppComponent implements OnInit {
  title = 'hire-tracker-app';

  constructor(
    private translationService: TranslateService,
    private router: Router,
    private gtmService: GoogleTagManagerService,
    private analyticsService: AnalyticsService) {
      const langCode: string = navigator.language.split("-")[0];
      this.translationService.addLangs(['en']);
      this.translationService.setDefaultLang(langCode);
      this.translationService.use(langCode);
  }

  ngOnInit(): void {
    this.analyticsService.startGoogleAnalytics();

    this.router.events.subscribe((item) => {
      if (item instanceof NavigationEnd) {
        const gtmTag = { event: 'page', pageName: item.url };
        this.gtmService.pushTag(gtmTag).then(() => { }).catch(error => { });
      }
    });
    this.analyticsService.trackPages(this.router);
  }

  navigateToModule(modulePath: string) {
    this.router.navigate([`/${modulePath}`]).then(() => { }).catch(error => { });

    this.router.events.subscribe(item => {
      if (item instanceof NavigationEnd) {
        const gtmTag = {
          event: 'page',
          pageName: item.url
        };
        this.gtmService.pushTag(gtmTag).then(() => { }).catch(error => { });;
      }
    });

    // page tracking
    this.analyticsService.trackPages(this.router);
  }
}
