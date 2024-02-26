import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaderResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { NotifyService } from '../services/notify/notify.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private notify:NotifyService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      //let succcessful events thru
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        //display a toast with the error message
        console.error(error)
        if (error.error && error.error.message) {
          this.notify.failNotification(error.error.message);
        } else {
          // Fallback to a generic error message if the server's message is not available
          this.notify.failNotification('An error occurred. Please try again later.');
        }
        // this.notify.failNotification(error.message)
        return throwError(() => error);

      })
    );
  }
}
