import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BRAND_LOGO_SRC } from '../../shared/constants/brand';

interface DashboardNavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {
  protected readonly brandLogoSrc = BRAND_LOGO_SRC;
  protected readonly sidebarCollapsed = signal(false);

  protected readonly navItems: DashboardNavItem[] = [
    { label: 'Overview', path: '/dashboard', icon: 'dashboard' },
    { label: 'Applications', path: '/dashboard/applications', icon: 'description' },
    { label: 'Saved Colleges', path: '/dashboard/saved', icon: 'bookmark' },
    { label: 'Exams', path: '/dashboard/exams', icon: 'calendar_month' },
    { label: 'Profile', path: '/dashboard/profile', icon: 'person' },
  ];

  protected toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }
}
