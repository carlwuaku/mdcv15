import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject, map, of } from "rxjs";
import { LOCAL_USER_TOKEN } from "src/app/shared/utils/constants";
import { User } from "../models/user.model";
import { HttpService } from "../services/http/http.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User | null = null;
  isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private dbService: HttpService, private router: Router) {

  }

  /**
   * hasPermission
   */
  public hasPermission(permission: string): boolean {
    return this.currentUser ? this.currentUser.permissions.includes(permission) : false;
  }

  // Add an observable-based hasPermission method
  hasPermissionAsync(permission: string): Observable<boolean> {
    return this.getUser().pipe(
      map(user => user.permissions.includes(permission))
    );
  }

  public logout(): void {
    localStorage.removeItem(LOCAL_USER_TOKEN);
    this.isLoggedIn$.next(false);

    this.currentUser = new User();
  }


  setCookie(cname: string, cvalue: string) {
    localStorage.setItem(cname, cvalue);

  }

  checkLogin(): boolean {
    const token = this.getCookie(LOCAL_USER_TOKEN);
    if (token !== null) {
      this.isLoggedIn$.next(true);
      return true;
    }

    this.isLoggedIn$.next(false);
    this.router.navigate(['/login']);
    return false;
  }

  getCookie(cname: string) {
    return localStorage.getItem(cname);
  }

  getUser(): Observable<User> {
    if (this.currentUser) {
      return of(this.currentUser)
    }
    return this.dbService.get<{ user: User, permissions: string[] }>("admin/profile").pipe(map(data => {
      this.currentUser = data.user;
      this.currentUser!.permissions = data.permissions
      return this.currentUser!;
    }));
  }

}
