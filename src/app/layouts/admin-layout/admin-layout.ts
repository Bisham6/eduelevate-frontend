import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminAuthStore } from '../../core/admin/admin-auth.store';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  private readonly auth = inject(AdminAuthStore);
  private readonly router = inject(Router);

  protected readonly isAuthenticated = this.auth.isAuthenticated;
  protected keyInput = signal('');

  protected navItems = [
    { label: 'Dashboard', path: '/admin', icon: 'dashboard' },
    { label: 'Colleges', path: '/admin/colleges', icon: 'apartment' },
  ];

  protected onLogin(): void {
    const key = this.keyInput().trim();
    if (!key) return;
    this.auth.setKey(key);
  }

  protected onLogout(): void {
    this.auth.clear();
    this.router.navigate(['/admin']);
  }
}
