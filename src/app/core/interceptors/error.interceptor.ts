import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AdminAuthStore } from '../admin/admin-auth.store';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly auth = inject(AdminAuthStore);
  private readonly router = inject(Router);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          (error.status === 401 || error.status === 403) &&
          req.url.includes('/admin/')
        ) {
          this.auth.clear();
          this.router.navigate(['/admin/login']);
        }

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
