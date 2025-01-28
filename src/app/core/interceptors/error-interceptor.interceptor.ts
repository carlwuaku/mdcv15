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

  constructor(private notify: NotifyService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      //let succcessful events thru
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error: any) => {
        //display a toast with the error message
        console.log('ErrorInterceptor', error)
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Connection Error: ${error.error.message}`;

        }
        else if (typeof (error.error) === "string") {
          errorMessage = `${error.error}`;
        }
        else if (typeof (error.error) === "object") {

          if ('message' in error.error) {
            errorMessage = error.error.message;
          }
          else if ('errors' in error.error) {
            errorMessage = "";
            for (const key in error.error.errors) {
              errorMessage += `${key}: ${error.error.errors[key]}\n`
            }
          }

          else {
            errorMessage = JSON.stringify(error.error)
          }

        }
        else if ('message' in error) {//this will be something like Http failure response for http://localhost:8080/licenses/details: 400 Bad Request
          errorMessage = error.message;
        }

        else {
          // server-side error

          errorMessage = `Server Error Code: ${error.status}\n Message: ${error.message}`;

        }
        this.notify.failNotification(errorMessage)
        // this.notify.failNotification(error.message)
        return throwError(() => error);

      })
    );
  }
}
