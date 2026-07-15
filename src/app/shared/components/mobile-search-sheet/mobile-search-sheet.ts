import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MobileSearchService } from '../../../core/services/mobile-search.service';
import { SearchAutocomplete } from '../search-autocomplete/search-autocomplete';

@Component({
  selector: 'app-mobile-search-sheet',
  imports: [FormsModule, SearchAutocomplete],
  templateUrl: './mobile-search-sheet.html',
  styleUrl: './mobile-search-sheet.scss',
})
export class MobileSearchSheet {
  private readonly mobileSearch = inject(MobileSearchService);
  private readonly router = inject(Router);

  protected readonly isOpen = this.mobileSearch.open;
  protected searchQuery = '';

  protected get searchMode(): 'colleges' | 'courses' | 'exams' {
    if (this.router.url.startsWith('/courses')) return 'courses';
    if (this.router.url.startsWith('/exams')) return 'exams';
    return 'colleges';
  }

  protected get searchPlaceholder(): string {
    return 'Search colleges, exams, or courses';
  }

  protected close(): void {
    this.mobileSearch.hide();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  protected onSearch(event: Event): void {
    event.preventDefault();
    this.navigateSearch();
  }

  protected onSearchSubmit(query: string): void {
    this.searchQuery = query;
    this.navigateSearch();
  }

  private navigateSearch(): void {
    const q = this.searchQuery.trim();
    if (!q) return;

    if (this.router.url.startsWith('/courses')) {
      this.router.navigate(['/courses'], { queryParams: { search: q } });
    } else if (this.router.url.startsWith('/exams')) {
      this.router.navigate(['/exams'], { queryParams: { search: q } });
    } else {
      this.router.navigate(['/colleges'], { queryParams: { search: q } });
    }
    this.close();
  }
}
