import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from 'rxjs';
import {
  SearchSuggestMode,
  SearchSuggestService,
  SearchSuggestion,
} from '../../services/search-suggest.service';

@Component({
  selector: 'app-search-autocomplete',
  imports: [FormsModule],
  templateUrl: './search-autocomplete.html',
  styleUrl: './search-autocomplete.scss',
})
export class SearchAutocomplete {
  private readonly suggestService = inject(SearchSuggestService);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly mode = input<SearchSuggestMode>('colleges');
  readonly placeholder = input('Search...');
  readonly ariaLabel = input('Search');
  readonly name = input('searchQuery');
  readonly inputClass = input(
    'h-11 w-full rounded-btn border border-outline-variant bg-white pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
  );

  readonly query = model('');
  readonly submitted = output<string>();

  private readonly search$ = new Subject<string>();

  protected readonly suggestions = signal<SearchSuggestion[]>([]);
  protected readonly loading = signal(false);
  protected readonly panelOpen = signal(false);
  protected readonly listboxId = `search-suggestions-${Math.random().toString(36).slice(2, 9)}`;

  constructor() {
    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((q) => {
          if (q.trim().length < 2) {
            this.suggestions.set([]);
            this.loading.set(false);
          } else {
            this.loading.set(true);
          }
        }),
        switchMap((q) => {
          const trimmed = q.trim();
          if (trimmed.length < 2) {
            return of([] as SearchSuggestion[]);
          }
          return this.suggestService.suggest(this.mode(), trimmed).pipe(
            catchError(() => of([] as SearchSuggestion[])),
          );
        }),
      )
      .subscribe((items) => {
        this.suggestions.set(items);
        this.loading.set(false);
        if (this.query().trim().length >= 2) {
          this.panelOpen.set(true);
        }
      });
  }

  protected onInput(value: string): void {
    this.query.set(value);
    if (value.trim().length < 2) {
      this.panelOpen.set(false);
      this.suggestions.set([]);
    }
    this.search$.next(value);
  }

  protected onFocus(): void {
    if (this.query().trim().length >= 2 && (this.suggestions().length > 0 || this.loading())) {
      this.panelOpen.set(true);
    }
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.panelOpen.set(false);
    this.submitted.emit(this.query().trim());
  }

  protected selectSuggestion(suggestion: SearchSuggestion): void {
    this.panelOpen.set(false);
    this.query.set(suggestion.label);
    void this.router.navigateByUrl(suggestion.path);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.panelOpen.set(false);
      return;
    }
    if (
      event.key === 'Enter' &&
      this.panelOpen() &&
      this.suggestions().length > 0 &&
      !this.loading()
    ) {
      event.preventDefault();
      this.selectSuggestion(this.suggestions()[0]);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.panelOpen.set(false);
    }
  }
}
