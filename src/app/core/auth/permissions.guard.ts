import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { NotifyService } from '../services/notify/notify.service';
@Injectable({
  providedIn: 'root'
})
export class PermissionsGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private notifyService: NotifyService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const permission = route.data['permission'];
    return this.authService.getUser().pipe(
      map(user => {
        if (user && user.permissions.includes(permission)) {
          return true;
        } else {
          this.notifyService.failNotification("You do not have permission to access this page");
          return false;
        }
      }),
      catchError(error => {
        console.error('Error checking permissions:', error);
        this.notifyService.failNotification("Error checking permissions");
        return of(false);
      })
    );
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const permission = childRoute.data['permission'];
    return this.authService.getUser().pipe(
      map(user => {
        if (user && user.permissions.includes(permission)) {
          return true;
        } else {
          this.notifyService.failNotification("You do not have permission to access this page");
          return false;
        }
      }),
      catchError(error => {
        console.error('Error checking permissions:', error);
        this.notifyService.failNotification("Error checking permissions");
        return of(false);
      })
    );
  }

}
