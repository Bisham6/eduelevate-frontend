import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { MobileFilterDrawerService } from '../../../core/services/mobile-filter-drawer.service';

interface BottomNavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-bottom-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav-bar.html',
  styleUrl: './bottom-nav-bar.scss',
})
export class BottomNavBar {
  private readonly router = inject(Router);
  private readonly filterDrawer = inject(MobileFilterDrawerService);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly showFilterNav = computed(() =>
    this.filterDrawer.isListingFilterRoute(this.currentUrl()),
  );

  protected readonly drawerOpen = this.filterDrawer.open;

  protected readonly tabs: BottomNavItem[] = [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Colleges', path: '/colleges', icon: 'account_balance' },
    { label: 'Courses', path: '/courses', icon: 'school' },
  ];

  protected toggleFilters(): void {
    this.filterDrawer.toggle();
  }
}
