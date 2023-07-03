import { Router } from '@angular/router';
import {
  HttpErrorResponse,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { ErrorInterceptorService } from './global-error-handler.interceptor';

describe('ErrorInterceptorService', () => {
  let service: ErrorInterceptorService;
  let router: Router;
  let request: HttpRequest<any>;
  let next: HttpHandler;

  beforeEach(() => {
    router = {
      navigate: jest.fn(),
    } as unknown as Router;
    service = new ErrorInterceptorService(router);
    request = new HttpRequest('GET', '/test');
    next = {
      handle: () => {
        return throwError(
          new HttpErrorResponse({
            status: 500,
            statusText: 'Internal Server Error',
          })
        );
      },
    } as unknown as HttpHandler;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle client-side errors', () => {
    const error = new ErrorEvent('test');

    service.intercept(request, next).subscribe({
      error: () => {
        expect(console.error).toHaveBeenCalledWith(`Error: ${error.message}`);
        expect(router.navigate).toHaveBeenCalledWith(['/error']);
      },
    });
  });

  it('should handle backend errors', () => {
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
    });

    service.intercept(request, next).subscribe({
      error: () => {
        expect(console.error).toHaveBeenCalledWith(
          `Error Code: ${error.status}\nMessage: ${error.message}`
        );
        expect(router.navigate).toHaveBeenCalledWith(['/error']);
      },
    });
  });
});
