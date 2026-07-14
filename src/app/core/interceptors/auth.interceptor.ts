import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminAuthStore } from '../admin/admin-auth.store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly auth: AdminAuthStore) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.getToken();
    if (token && req.url.includes('/admin/')) {
      return next.handle(
        req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }),
      );
    }
    return next.handle(req);
  }
}
