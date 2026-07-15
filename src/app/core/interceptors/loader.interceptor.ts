import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';
import { SKIP_LOADER } from './skip-loader.context';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private readonly loader: LoaderService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.context.get(SKIP_LOADER)) {
      return next.handle(req);
    }

    this.loader.show();
    return next.handle(req).pipe(finalize(() => this.loader.hide()));
  }
}
