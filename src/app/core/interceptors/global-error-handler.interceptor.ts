import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotifyService } from '../services/notify/notify.service';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {
  constructor(private notify: NotifyService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          console.log(event)
          if (event.body.status === "0") {
            const errorMessage = `Authentication Error: ${event.body.message}`
            // this.notify.failNotification(errorMessage)

            throw new Error(errorMessage)
          }
          else if (event.body.status === "-9") {
            const errorMessage = `Permission Error: ${event.body.message}`
            // this.notify.failNotification(errorMessage)

            throw new Error(errorMessage)
          }
          else if (event.body.status === "-1") {
            const errorMessage = `Server Error: ${event.body.message}`
            // this.notify.failNotification(errorMessage)
            throw new Error(errorMessage)
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error)
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Connection Error: ${error.error.message}`;

        }
        else if(typeof(error.error) === "string"){
          errorMessage = `${error.error}`;
        }
        else if(typeof(error.error) === "object"){
          if('message' in error.error){
            errorMessage = error.error.message;
          }
          else{
            errorMessage = JSON.stringify( error.error)
          }

        }

        else {
          // server-side error

          errorMessage = `Server Error Code: ${error.status}\n Message: ${error.message}`;

        }
        this.notify.failNotification(errorMessage)

        return throwError(() => error);
      })
    );
  }
}
