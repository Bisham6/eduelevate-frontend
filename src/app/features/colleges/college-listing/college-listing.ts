import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CollegeService } from '../../../shared/services/college.service';
import { CollegeFilterStore } from '../../../shared/stores/college-filter.store';
import { CompareStore } from '../../../shared/stores/compare.store';
import { College, CollegeFilters, CollegeSortOption } from '../../../shared/models';
import {
  Breadcrumb,
  SectionHeader,
  FilterSidebar,
  AcademicCard,
  Pagination,
  Skeleton,
  EmptyState,
} from '../../../shared/components';
import {
  buildCollegeFilterSections,
  CATEGORY_LABELS,
  getCategoryPageTitle,
} from '../../../shared/config/college-filter.config';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-college-listing',
  imports: [Breadcrumb, SectionHeader, FilterSidebar, AcademicCard, Pagination, Skeleton, EmptyState],
  templateUrl: './college-listing.html',
  styleUrl: './college-listing.scss',
})
export class CollegeListing implements OnInit {
  private readonly collegeService = inject(CollegeService);
  private readonly filterStore = inject(CollegeFilterStore);
  private readonly compareStore = inject(CompareStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  protected readonly colleges = signal<College[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly filters = this.filterStore.filters;

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

  protected readonly sortOptions: { label: string; value: CollegeSortOption }[] = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'NIRF Rank (Low to High)', value: 'nirf_asc' },
    { label: 'NIRF Rank (High to Low)', value: 'nirf_desc' },
    { label: 'Fees (Low to High)', value: 'fees_asc' },
    { label: 'Fees (High to Low)', value: 'fees_desc' },
    { label: 'Rating', value: 'rating_desc' },
  ];

  constructor() {
    effect(() => {
      const category = this.filters().category;
      const title = getCategoryPageTitle(category);
      const categoryLabel = category ? CATEGORY_LABELS[category] ?? category : 'all';
      this.seo.update({
        title,
        description: `Browse and filter top ${categoryLabel} colleges by location, fees, NIRF ranking, and specialization on EduElevate.`,
        keywords: category ? `${categoryLabel} colleges, ${categoryLabel} admission, NIRF ranking` : 'colleges, admission, NIRF ranking',
      });
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const updates: Partial<CollegeFilters> = {};
      if (params['search']) updates.search = params['search'];
      if (params['category']) updates.category = params['category'];
      if (params['location']) updates.location = [params['location']];
      if (Object.keys(updates).length) this.filterStore.update(updates);
      this.loadColleges();
    });
  }

  protected loadColleges(): void {
    this.loading.set(true);
    this.error.set(null);

    this.collegeService.getColleges(this.filters()).subscribe({
      next: (res) => {
        this.colleges.set(res.data);
        this.total.set(res.meta.total);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.friendlyMessage || 'Failed to load colleges. Make sure the backend is running.');
        this.loading.set(false);
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
    this.loadColleges();
  }

  protected onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as CollegeSortOption;
    this.filterStore.setSort(value);
    this.loadColleges();
  }

  protected onPageChange(page: number): void {
    this.filterStore.setPage(page);
    this.loadColleges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
