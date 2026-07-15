import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  readonly loading = signal(false);

  private activeRequests = 0;
  private showTimer: ReturnType<typeof setTimeout> | null = null;

  private static readonly SHOW_DELAY_MS = 200;

  show(): void {
    this.activeRequests++;

    if (this.activeRequests === 1 && !this.showTimer) {
      this.showTimer = setTimeout(() => {
        this.showTimer = null;
        if (this.activeRequests > 0) {
          this.loading.set(true);
        }
      }, LoaderService.SHOW_DELAY_MS);
    }
  }

  hide(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);

    if (this.activeRequests === 0) {
      if (this.showTimer) {
        clearTimeout(this.showTimer);
        this.showTimer = null;
      }
      this.loading.set(false);
    }
  }
}
