import { Component, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs';
import { API_ADMIN_PATH, LOCAL_USER_ID, LOCAL_USER_KEY, LOGIN_FLASH_MESSSAGE } from 'src/app/shared/utils/constants';
import { AuthService } from '../../auth/auth.service';
import { IUser } from '../../models/user.model';
import { HttpService } from '../../services/http/http.service';

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
  user!:IUser;
  loading: boolean = false;
  flash_message: string | null = "";


  constructor(public authService: AuthService,
    private dbService: HttpService) {
    // this.dbService.setTitle("Login");

  }

  ngOnInit() {
    this.authService.logout();
    this.flash_message = localStorage.getItem(LOGIN_FLASH_MESSSAGE)
    if (this.flash_message != null) {
      localStorage.removeItem(LOGIN_FLASH_MESSSAGE);
    }
  }



  login() {
    this.loading = true;
    this.error = false;

    let data = new FormData();
    data.append('username', this.username);
    data.append('password', this.password);
    this.dbService.post<any>(`${API_ADMIN_PATH}/login`, data)
      .pipe(take(1))
      .subscribe({next: (data:any) => {
      if (data.status === "1") {
        this.authService.currentUser = data.user_data;

        this.authService.setCookie(LOCAL_USER_ID, data.user_data.id);

        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(data.user_data));
        window.location.assign('/');
      }
      else {
        this.error = true;
        this.loading = false;
        this.error_message = "Wrong combination. Try again";
      }
      },
      error: (err) => {
        this.loading = false;
      },});
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
      this.dbService.post < { message: string }>("send_reset_password_link_email",data).subscribe(data => {
        alert(data.message);


      });
    }
  }
}
