import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './core/auth/auth.service';
import { HttpService } from './core/services/http/http.service';
import { API_PATH } from './shared/utils/constants';
import { MenuItem } from './shared/utils/data';
interface AppSettings {
  appName: string,
  appVersion: string,
  appLongName: string,
  logo: string,
  recaptchaSiteKey: string,
  sidebarMenu: MenuItem[]
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
    sidebarMenu: []
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
