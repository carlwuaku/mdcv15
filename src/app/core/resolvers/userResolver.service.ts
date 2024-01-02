import { Observable } from "rxjs";
import { User } from "../models/user.model";
import { AuthService } from "../auth/auth.service";



import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';

export const UserResolver: ResolveFn<User> = (
 route: ActivatedRouteSnapshot,
 state: RouterStateSnapshot,
 authService: AuthService = inject(AuthService)
): Observable<User> => authService.getUser();
