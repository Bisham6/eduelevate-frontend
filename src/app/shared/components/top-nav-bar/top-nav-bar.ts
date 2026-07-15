import { Component, signal, inject, HostListener, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BRAND_LOGO_SRC } from '../../constants/brand';
import { SearchAutocomplete } from '../search-autocomplete/search-autocomplete';
import { LeadCaptureService } from '../../services/lead-capture.service';
import { MobileSearchService } from '../../../core/services/mobile-search.service';

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
export class TopNavBar implements OnDestroy {
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly leadCapture = inject(LeadCaptureService);
  private readonly mobileSearch = inject(MobileSearchService);

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
    if (this.router.url.startsWith('/courses')) return 'Search courses...';
    if (this.router.url.startsWith('/exams')) return 'Search exams...';
    return 'Search colleges...';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.mobileMenuOpen()) {
      this.closeMobileMenu();
    }
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
    this.syncBodyScroll();
  }

  protected closeMobileMenu(): void {
    if (!this.mobileMenuOpen()) return;
    this.mobileMenuOpen.set(false);
    this.syncBodyScroll();
  }

  protected openMobileSearch(): void {
    this.closeMobileMenu();
    this.mobileSearch.show();
  }

  protected onComingSoonNav(): void {
    this.toastr.info('Coming soon...');
    this.closeMobileMenu();
  }

  protected onGetStarted(): void {
    this.leadCapture.open({ source: 'get_started' });
    this.closeMobileMenu();
  }

  protected onSearch(event: Event): void {
    event.preventDefault();
    const q = this.searchQuery.trim();
    if (!q) return;

    if (this.router.url.startsWith('/courses')) {
      this.router.navigate(['/courses'], { queryParams: { search: q } });
    } else if (this.router.url.startsWith('/exams')) {
      this.router.navigate(['/exams'], { queryParams: { search: q } });
    } else {
      this.router.navigate(['/colleges'], { queryParams: { search: q } });
    }
  }

  private syncBodyScroll(): void {
    document.body.style.overflow = this.mobileMenuOpen() ? 'hidden' : '';
  }
}
