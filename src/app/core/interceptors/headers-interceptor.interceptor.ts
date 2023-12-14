import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class HeadersInterceptorInterceptor implements HttpInterceptor {

  constructor(private auth:AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const headers: HttpHeaders = this.generateHeaders();
    const modifiedRequest = request.clone({
      headers: headers
    })
    return next.handle(modifiedRequest);
  }

  private generateHeaders():HttpHeaders {
    //the user's auth details should be used to generate 
    //some headers here
    return new HttpHeaders({ 'Userid': this.auth.currentUser.id, 'Token': this.auth.currentUser.token, 'Type': '_admin' })
  }
}
