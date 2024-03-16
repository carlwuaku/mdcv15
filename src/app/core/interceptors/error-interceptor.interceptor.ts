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
      catchError((error: any) => {
        //display a toast with the error message
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
        // this.notify.failNotification(error.message)
        return throwError(() => error);

      })
    );
  }
}
