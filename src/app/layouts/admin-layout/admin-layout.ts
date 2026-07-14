import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminAuthStore } from '../../core/admin/admin-auth.store';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  private readonly auth = inject(AdminAuthStore);
  private readonly router = inject(Router);

  protected readonly currentUser = this.auth.currentUser;

  protected navItems = [
    { label: 'Dashboard', path: '/admin', icon: 'dashboard' },
    { label: 'Colleges', path: '/admin/colleges', icon: 'apartment' },
    { label: 'Leads', path: '/admin/leads', icon: 'group' },
  ];

  protected onLogout(): void {
    this.auth.clear();
    this.router.navigate(['/']);
  }
}
