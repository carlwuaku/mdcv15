import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './core/auth/auth.service';
import { HttpService } from './core/services/http/http.service';
import { API_PATH } from './shared/utils/constants';
import { MenuItem, RenewalStageItems } from './shared/utils/data';
import { IFormGenerator } from './shared/components/form-generator/form-generator-interface';
interface AppSettings {
  appName: string,
  appVersion: string,
  appLongName: string,
  logo: string,
  recaptchaSiteKey: string,
  sidebarMenu: MenuItem[],
  dashboardMenu: MenuItem[],
  searchTypes: { label: string, key: string, url: string }[],
  licenseTypes: {
    [key: string]: {
      table: string,
      detailsPageHeaderTabs: { label: string, key: string }[],
      renewalFields: IFormGenerator[],
      renewalStages: {
        [key: string]: RenewalStageItems
      },
      renewalFilterFields: IFormGenerator[]
    },

  }

}
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
    searchTypes: [],
    licenseTypes: {},
  });
  constructor(private authService: AuthService,
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
