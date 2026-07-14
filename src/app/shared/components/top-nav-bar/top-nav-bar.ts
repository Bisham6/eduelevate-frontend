import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-top-nav-bar',
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './top-nav-bar.html',
  styleUrl: './top-nav-bar.scss',
})
export class TopNavBar {
  private readonly router = inject(Router);

  protected readonly mobileMenuOpen = signal(false);
  protected searchQuery = '';

  protected readonly navLinks: NavLink[] = [
    { label: 'Colleges', path: '/colleges' },
    { label: 'Courses', path: '/courses' },
    { label: 'Exams', path: '/exams' },
    { label: 'Study Abroad', path: '/study-abroad' },
  ];

  protected get searchPlaceholder(): string {
    return this.router.url.startsWith('/courses') ? 'Search courses...' : 'Search colleges...';
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
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
