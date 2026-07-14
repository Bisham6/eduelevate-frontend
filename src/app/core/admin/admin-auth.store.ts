import { Injectable, signal, computed } from '@angular/core';
import { AdminUser } from '../auth/auth.models';

const TOKEN_KEY = 'eduelevate_admin_token';
const USER_KEY = 'eduelevate_admin_user';

@Injectable({ providedIn: 'root' })
export class AdminAuthStore {
  private readonly _token = signal<string>(this.loadToken());
  private readonly _user = signal<AdminUser | null>(this.loadUser());

  readonly token = this._token.asReadonly();
  readonly currentUser = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  setSession(token: string, user: AdminUser, remember: boolean): void {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user));
    this.clearOtherStorage(remember);
    this._token.set(token);
    this._user.set(user);
  }

  clear(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set('');
    this._user.set(null);
  }

  getToken(): string {
    return this._token();
  }

  private loadToken(): string {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || '';
  }

  private loadUser(): AdminUser | null {
    const raw =
      sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AdminUser;
    } catch {
      return null;
    }
  }

  private clearOtherStorage(remember: boolean): void {
    const other = remember ? sessionStorage : localStorage;
    other.removeItem(TOKEN_KEY);
    other.removeItem(USER_KEY);
  }
}
