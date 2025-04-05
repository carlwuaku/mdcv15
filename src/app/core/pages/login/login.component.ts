import { Component, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs';
import { API_ADMIN_PATH, API_PATH, LOCAL_USER_ID, LOCAL_USER_KEY, LOCAL_USER_TOKEN, LOGIN_FLASH_MESSSAGE } from 'src/app/shared/utils/constants';
import { AuthService } from '../../auth/auth.service';
import { IUser, User } from '../../models/user.model';
import { HttpService } from '../../services/http/http.service';
import { AppService } from 'src/app/app.service';
import { NotifyService } from '../../services/notify/notify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  message: string = "";
  username!: string;
  password!: string;
  error: boolean = false;
  error_message: string = "";
  user!: IUser;
  loading: boolean = false;
  flash_message: string | null = "";
  appName: string = "";
  logo: string = "";
  recaptchaVerified: boolean = false;
  recaptchaSiteKey: string = "";
  twoFactorAuthMode: boolean = false;
  twoFactorCode: string = "";
  twoFactorToken: string = "";
  constructor(public authService: AuthService,
    private dbService: HttpService, private appService: AppService, private notify: NotifyService) {
    this.appService.appSettings.subscribe(data => {
      this.appName = data.appLongName;
      this.logo = data.logo;
      this.recaptchaSiteKey = data.recaptchaSiteKey;
    })

  }

  ngOnInit() {
    this.authService.logout();
    this.flash_message = localStorage.getItem(LOGIN_FLASH_MESSSAGE)
    if (this.flash_message != null) {
      localStorage.removeItem(LOGIN_FLASH_MESSSAGE);
    }
  }



  login() {
    if (!this.recaptchaVerified) {
      this.error = true;
      this.notify.failNotification("Recaptcha verification failed. Try again");
      this.error_message = "Recaptcha verification failed. Try again";
      return;
    }
    this.loading = true;
    this.error = false;

    let data = new FormData();
    data.append('email', this.username);
    data.append('password', this.password);
    data.append('device_name', 'admin portal');
    this.dbService.post<{ token: string, requires_2fa: boolean, user: User, message: string }>(`${API_PATH}/mobile-login`, data)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if (response.requires_2fa) {
            this.twoFactorAuthMode = true;
            this.twoFactorToken = response.token;
            this.loading = false;
            this.error = false;
            this.error_message = "";
            return;
          }
          localStorage.setItem(LOCAL_USER_TOKEN, response.token);
          // this.authService.currentUser = response.user;
          window.location.assign('/');
        },
        error: (err) => {
          this.error = true;
          this.error_message = err.error.message
          this.loading = false;
        },
      });
  }

  submit2FA() {
    this.loading = true;
    this.error = false;

    let data = new FormData();
    data.append('code', this.twoFactorCode);
    data.append('token', this.twoFactorToken);
    data.append('device_name', 'admin portal');
    data.append('verification_mode', '2fa');
    this.dbService.post<{ token: string, requires_2fa: boolean, user: User, message: string }>(`${API_PATH}/mobile-login`, data)
      .pipe(take(1))
      .subscribe({
        next: (response) => {

          localStorage.setItem(LOCAL_USER_TOKEN, response.token);
          // this.authService.currentUser = response.user;
          window.location.assign('/');
        },
        error: (err) => {
          this.error = true;
          this.error_message = err.error.message
          this.loading = false;
        },
      });
  }

  logout() {
    this.authService.logout();
  }

  forgotPassword() {
    let input = window.prompt("Enter your username. If you have forgotten your username please contact the Registration Unit for assistance");

    if (input) {
      const reg = input.trim();
      let data = new FormData();
      data.append("username", reg)
      this.dbService.post<{ message: string }>("send_reset_password_link_email", data).subscribe(data => {
        alert(data.message);


      });
    }
  }

  resolved(response: string) {
    const body = { 'g-recaptcha-response': response };
    this.dbService.post<{ message: string }>(API_PATH + '/verify-recaptcha', body).subscribe({
      next: (res) => {
        this.recaptchaVerified = true;
        this.error_message = "";
      },
      error: (err) => {
        // Handle HTTP error
        this.recaptchaVerified = false;
        this.error_message = "Recaptcha verification failed. Try again";
      },
    });


  }

  recaptchaError() {
    this.recaptchaVerified = false;
    this.error_message = "Recaptcha verification failed. Try again";
  }

}
