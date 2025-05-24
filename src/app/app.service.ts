import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './core/auth/auth.service';
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
    searchTypes: [],
    licenseTypes: {},
    cpdFilterFields: [],
    housemanship: {
      availabilityCategories: [],
      sessions: {}
    },
  });
  constructor(
    private dbService: HttpService,) {
    this.dbService.get<AppSettings>(API_PATH + '/app-settings').subscribe({
      next: (response) => {
        this.appSettings.next(response)
      },
      error(err) {
        console.log(err)
      },
    })
  }
}
