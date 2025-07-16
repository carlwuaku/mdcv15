import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
    }
  });
  constructor(
    private dbService: HttpService) {
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
