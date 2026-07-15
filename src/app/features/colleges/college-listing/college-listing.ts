import { Component, OnInit, OnDestroy, inject, signal, computed, effect } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CollegeService } from '../../../shared/services/college.service';
import { CollegeFilterStore } from '../../../shared/stores/college-filter.store';
import { CompareStore } from '../../../shared/stores/compare.store';
import { College, CollegeFilters } from '../../../shared/models';
import {
  Breadcrumb,
  SectionHeader,
  FilterSidebar,
  AcademicCard,
  Skeleton,
  EmptyState,
} from '../../../shared/components';
import { InfiniteScrollDirective } from '../../../shared/directives';
import {
  buildCollegeFilterSections,
  CATEGORY_LABELS,
  getCategoryPageTitle,
} from '../../../shared/config/college-filter.config';
import { SeoService } from '../../../core/services/seo.service';
import { MobileFilterDrawerService } from '../../../core/services/mobile-filter-drawer.service';

@Component({
  selector: 'app-college-listing',
  imports: [Breadcrumb, SectionHeader, FilterSidebar, AcademicCard, Skeleton, EmptyState, InfiniteScrollDirective],
  templateUrl: './college-listing.html',
  styleUrl: './college-listing.scss',
})
export class CollegeListing implements OnInit, OnDestroy {
  private readonly collegeService = inject(CollegeService);
  private readonly filterStore = inject(CollegeFilterStore);
  private readonly compareStore = inject(CompareStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly mobileFilterDrawer = inject(MobileFilterDrawerService);

  protected readonly colleges = signal<College[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(true);
  protected readonly loadingMore = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly filters = this.filterStore.filters;

  protected readonly hasMore = computed(() => this.colleges().length < this.total());

  protected readonly filterSections = computed(() =>
    buildCollegeFilterSections(this.filters().category),
  );

  protected readonly selectedFilters = computed(() => {
    const f = this.filters();
    return {
      category: f.category ? [f.category] : [],
      location: f.location ?? [],
      feesRange: f.feesRange ? [f.feesRange] : [],
      nirfRanking: f.nirfRanking ?? [],
      specialization: f.specialization ?? [],
    };
  });

  protected readonly pageTitle = computed(() => getCategoryPageTitle(this.filters().category));

  protected readonly breadcrumbs = computed(() => {
    const category = this.filters().category;
    const items: { label: string; path?: string }[] = [{ label: 'Home', path: '/' }];

    if (category) {
      items.push({
        label: CATEGORY_LABELS[category] ?? category,
        path: `/colleges?category=${category}`,
      });
    } else {
      items.push({ label: 'Colleges', path: '/colleges' });
    }

    items.push({ label: 'India' });
    return items;
  });

  constructor() {
    effect(() => {
      const category = this.filters().category;
      const title = getCategoryPageTitle(category);
      const categoryLabel = category ? CATEGORY_LABELS[category] ?? category : 'all';
      this.seo.update({
        title,
        description: `Browse and filter top ${categoryLabel} colleges by location, fees, NIRF ranking, and specialization on CollegeChuniye.`,
        keywords: category ? `${categoryLabel} colleges, ${categoryLabel} admission, NIRF ranking` : 'colleges, admission, NIRF ranking',
      });
    });
  }

  ngOnInit(): void {
    this.mobileFilterDrawer.register({
      kind: 'standard',
      title: 'Filters',
      sections: () => this.filterSections(),
      selectedValues: () => this.selectedFilters(),
      onValueChange: (event) => this.onFilterChange(event),
      onClearAll: () => this.onClearFilters(),
      onApply: () => this.onApplyFilters(),
    });

    this.route.queryParams.subscribe((params) => {
      const updates: Partial<CollegeFilters> = {};
      if (params['search']) updates.search = params['search'];
      if (params['category']) updates.category = params['category'];
      if (params['location']) updates.location = [params['location']];
      if (Object.keys(updates).length) this.filterStore.update(updates);
      this.loadColleges();
    });
  }

  ngOnDestroy(): void {
    this.mobileFilterDrawer.unregister();
  }

  protected loadColleges(append = false): void {
    if (append) {
      this.loadingMore.set(true);
    } else {
      this.loading.set(true);
    }
    this.error.set(null);

    this.collegeService.getColleges(this.filters()).subscribe({
      next: (res) => {
        if (append) {
          this.colleges.update((current) => [...current, ...res.data]);
        } else {
          this.colleges.set(res.data);
        }
        this.total.set(res.meta.total);
        this.loading.set(false);
        this.loadingMore.set(false);
      },
      error: (err) => {
        this.error.set(err.friendlyMessage || 'Failed to load colleges. Make sure the backend is running.');
        this.loading.set(false);
        this.loadingMore.set(false);
      },
    });
  }

  protected onFilterChange(event: {
    sectionId: string;
    value: string;
    checked: boolean;
    type: 'checkbox' | 'radio';
  }): void {
    const f = this.filters();

    if (event.type === 'radio') {
      const key = event.sectionId as 'feesRange' | 'category';

      if (key === 'category') {
        this.filterStore.update({ category: event.value, specialization: [] });
        this.syncCategoryQueryParam(event.value);
      } else {
        this.filterStore.update({ [key]: event.value });
      }
      return;
    }

    const key = event.sectionId as 'location' | 'nirfRanking' | 'specialization';
    const current = [...(f[key] ?? [])];

    if (event.checked) {
      if (!current.includes(event.value)) current.push(event.value);
    } else {
      const idx = current.indexOf(event.value);
      if (idx > -1) current.splice(idx, 1);
    }

    this.filterStore.update({ [key]: current });
  }

  protected onClearFilters(): void {
    this.filterStore.clearAll();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: null },
      queryParamsHandling: 'merge',
    });
    this.loadColleges();
  }

  protected onApplyFilters(): void {
    this.filterStore.setPage(1);
    this.loadColleges();
  }

  protected onLoadMore(): void {
    if (!this.hasMore() || this.loading() || this.loadingMore()) return;
    const nextPage = (this.filters().page ?? 1) + 1;
    this.filterStore.setPage(nextPage);
    this.loadColleges(true);
  }

  protected onCompare(college: College): void {
    if (this.compareStore.add(college._id)) {
      this.router.navigate(['/compare']);
    }
  }

  private syncCategoryQueryParam(category: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category },
      queryParamsHandling: 'merge',
    });
  }
}
