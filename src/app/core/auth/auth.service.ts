import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject, map, of } from "rxjs";
import { API_ADMIN_PATH, API_PATH, LOCAL_USER_ID, LOCAL_USER_KEY, LOCAL_USER_TOKEN } from "src/app/shared/utils/constants";
import { User } from "../models/user.model";
import { HttpService } from "../services/http/http.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User | null = null;
  isLoggedIn$: Subject<boolean> = new Subject();
  constructor(private dbService: HttpService, private router: Router) {

  }

  /**
   * hasPermission
   */
  public hasPermission(permission: string): boolean {
    return this.currentUser ? this.currentUser.permissions.includes(permission) : false;
  }



  public logout(): void {
    localStorage.removeItem(LOCAL_USER_TOKEN);
    this.currentUser = new User();
  }


  setCookie(cname: string, cvalue: string) {
    localStorage.setItem(cname, cvalue);

  }

  checkLogin(url: string): boolean {
    const token = this.getCookie(LOCAL_USER_TOKEN);
    if (token !== null) {
      //check to see if logged in from the backend
      // this.dbService.get<{ status: string }>(`${API_PATH}/isLoggedIn`).subscribe(data => {
      //   if (data.status !== "1") {
      //     this.router.navigate(['/logout']);
      //     this.isLoggedIn$.next(false);
      //     return false;
      //   }
      //   else {
      //     this.isLoggedIn$.next(true);
      //     return true;
      //   }
      // });
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

  getCookie(cname: string) {
    return localStorage.getItem(cname);
  }

  getUser(): Observable<User> {
    console.log('loading user')
    if (this.currentUser) {
      console.log(this.currentUser)
      return of(this.currentUser)
    }
    //TODO: set the return type properly or assign the permissions on the server side
    return this.dbService.get<any>("admin/profile").pipe(map(data => {
      this.currentUser = data.user;
      this.currentUser!.permissions = data.permissions
      return data;
    }));
  }

}
