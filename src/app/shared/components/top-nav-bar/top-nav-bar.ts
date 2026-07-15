import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BRAND_LOGO_SRC } from '../../constants/brand';
import { SearchAutocomplete } from '../search-autocomplete/search-autocomplete';

interface NavLink {
  label: string;
  path: string;
  comingSoon?: boolean;
}

@Component({
  selector: 'app-top-nav-bar',
  imports: [RouterLink, RouterLinkActive, FormsModule, SearchAutocomplete],
  templateUrl: './top-nav-bar.html',
  styleUrl: './top-nav-bar.scss',
})
export class TopNavBar {
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  protected readonly brandLogoSrc = BRAND_LOGO_SRC;
  protected readonly mobileMenuOpen = signal(false);
  protected searchQuery = '';

  protected readonly navLinks: NavLink[] = [
    { label: 'Colleges', path: '/colleges' },
    { label: 'Courses', path: '/courses' },
    { label: 'Exams', path: '/exams' },
    { label: 'Study Abroad', path: '/study-abroad', comingSoon: true },
  ];

  protected get searchMode(): 'colleges' | 'courses' | 'exams' {
    if (this.router.url.startsWith('/courses')) return 'courses';
    if (this.router.url.startsWith('/exams')) return 'exams';
    return 'colleges';
  }

  protected get searchPlaceholder(): string {
    return this.router.url.startsWith('/courses') ? 'Search courses...' : 'Search colleges...';
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  protected onComingSoonNav(): void {
    this.toastr.info('Coming soon...');
    this.closeMobileMenu();
  }

  protected onSearch(event: Event): void {
    event.preventDefault();
    const q = this.searchQuery.trim();
    if (!q) return;

    if (this.router.url.startsWith('/courses')) {
      this.router.navigate(['/courses'], { queryParams: { search: q } });
    } else {
      this.router.navigate(['/colleges'], { queryParams: { search: q } });
    }
    this.closeMobileMenu();
  }
}
