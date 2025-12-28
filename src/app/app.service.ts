import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { HttpService } from './core/services/http/http.service';
import { API_PATH } from './shared/utils/constants';
import { AppSettings } from './shared/types/AppSettings.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  appSettings: BehaviorSubject<AppSettings> = new BehaviorSubject<AppSettings>({
    appName: '',
    appVersion: '',
    appLongName: '',
    logo: '',
    recaptchaSiteKey: '',
    sidebarMenu: [],
    dashboardMenu: [],
    renewalBasicStatisticsFilterFields: [],
    basicStatisticsFilterFields: [],
    advancedStatisticsFilterFields: [],
    basicStatisticsFields: [],
    searchTypes: [],
    licenseTypes: {},
    cpdFilterFields: [],
    housemanship: {
      availabilityCategories: [],
      sessions: {}
    },
    examinations: {
      filterFields: [],
      defaultLetterTypes: []
    },
    payments: {
      purposes: {},
      paymentMethods: {}
    }
  });

  private settingsRequest$: Observable<AppSettings> | null = null;

  constructor(
    private dbService: HttpService) {
    this.refreshAppSettings();
  }

  refreshAppSettings() {
    // If there's already a pending request, return it to prevent duplicate calls
    if (this.settingsRequest$) {
      return this.settingsRequest$;
    }

    // Create a new request and cache it with shareReplay
    this.settingsRequest$ = this.dbService.get<AppSettings>(API_PATH + '/app-settings').pipe(
      tap(response => {
        this.appSettings.next(response);
        this.setFavicon(response.logo);
      }),
      shareReplay(1)
    );

    this.settingsRequest$.subscribe({
      error(err) {
        console.log(err);
      },
    });

    return this.settingsRequest$;
  }

  private setFavicon(logoUrl: string) {
    if (!logoUrl) {
      return;
    }

    // Remove existing favicon links
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach(link => link.remove());

    // Create and add new favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = logoUrl;
    document.head.appendChild(link);
  }
}
