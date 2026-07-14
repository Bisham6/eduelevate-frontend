import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.error?.message ||
          (error.status === 0
            ? 'Unable to reach the server. Please check your connection.'
            : `Request failed (${error.status})`);

        console.error('[API Error]', req.url, message);
        return throwError(() => ({ ...error, friendlyMessage: message }));
      }),
    );
  }
}
