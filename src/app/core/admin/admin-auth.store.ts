import { Injectable, signal, computed } from '@angular/core';
import { environment } from '../../../environments/environment';

const STORAGE_KEY = 'eduelevate_admin_key';

@Injectable({ providedIn: 'root' })
export class AdminAuthStore {
  private readonly _apiKey = signal<string>(this.loadKey());

  readonly apiKey = this._apiKey.asReadonly();
  readonly isAuthenticated = computed(() => !!this._apiKey());

  setKey(key: string): void {
    sessionStorage.setItem(STORAGE_KEY, key);
    this._apiKey.set(key);
  }

  clear(): void {
    sessionStorage.removeItem(STORAGE_KEY);
    this._apiKey.set('');
  }

  getKey(): string {
    return this._apiKey() || environment.adminApiKey;
  }

  private loadKey(): string {
    return sessionStorage.getItem(STORAGE_KEY) || environment.adminApiKey || '';
  }
}
