import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { LOCAL_USER_TOKEN } from 'src/app/shared/utils/constants';

@Injectable()
export class HeadersInterceptorInterceptor implements HttpInterceptor {

  constructor(private auth:AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(request.url.endsWith('/mobile_login') || request.url.endsWith('/appName')){
      return next.handle(request);
    }
    let headers: HttpHeaders = request.headers;
    const token = localStorage.getItem(LOCAL_USER_TOKEN);
    if(token){
     headers = headers.set('Authorization', `Bearer ${token}`)
    }
    const modifiedRequest = request.clone({
      headers: headers
    })
    return next.handle(modifiedRequest);

  }

  // private generateHeaders():HttpHeaders {
  //   //the user's auth details should be used to generate
  //   //some headers here

  //   return new HttpHeaders({ 'Authorization': `Bearer ${token}`})
  // }
}
