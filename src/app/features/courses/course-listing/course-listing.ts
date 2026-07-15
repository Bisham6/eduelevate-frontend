import { Component, OnInit, OnDestroy, inject, signal, computed, effect, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../shared/services/course.service';
import { CourseFilterStore } from '../../../shared/stores/course-filter.store';
import { Course, CourseFilters } from '../../../shared/models';
import {
  CourseFilterSidebar,
  CourseCard,
  Skeleton,
  EmptyState,
} from '../../../shared/components';
import { InfiniteScrollDirective } from '../../../shared/directives';
import { COURSE_FILTER_SECTIONS } from '../../../shared/config/course-filter.config';
import { SeoService } from '../../../core/services/seo.service';
import { MobileFilterDrawerService } from '../../../core/services/mobile-filter-drawer.service';

@Component({
  selector: 'app-course-listing',
  imports: [CourseFilterSidebar, CourseCard, Skeleton, EmptyState, InfiniteScrollDirective],
  templateUrl: './course-listing.html',
  styleUrl: './course-listing.scss',
})
export class CourseListing implements OnInit, OnDestroy {
  private readonly courseService = inject(CourseService);
  private readonly filterStore = inject(CourseFilterStore);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly mobileFilterDrawer = inject(MobileFilterDrawerService);

  protected readonly courses = signal<Course[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(true);
  protected readonly loadingMore = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isMobile = signal(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

  protected readonly filters = this.filterStore.filters;
  protected readonly filterSections = COURSE_FILTER_SECTIONS;

  protected readonly selectedFilters = computed(() => {
    const f = this.filters();
    return {
      category: f.category ?? [],
      location: f.location ?? [],
      budgetRange: f.budgetRange ? [f.budgetRange] : [],
      ranking: f.ranking ?? [],
      mode: f.mode ?? [],
    };
  });

  protected readonly hasMore = computed(() => this.courses().length < this.total());

  constructor() {
    effect(() => {
      this.seo.update({
        title: 'Explore Trending Courses',
        description: 'Browse UG, PG, and professional courses across Engineering, Medical, MBA, Law, and Design on CollegeChuniye.',
        keywords: 'courses, B.Tech, MBBS, MBA, LLB, career paths, salary',
      });
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isMobile.set(window.innerWidth < 1024);
  }

  ngOnInit(): void {
    this.mobileFilterDrawer.register({
      kind: 'course',
      title: 'Refine Search',
      sections: () => this.filterSections,
      selectedValues: () => this.selectedFilters(),
      onValueChange: (event) => this.onFilterChange(event),
      onClearAll: () => this.onClearFilters(),
      onApply: () => this.onApplyFilters(),
    });

    this.route.queryParams.subscribe((params) => {
      const updates: Partial<CourseFilters> = {};
      if (params['search']) updates.search = params['search'];
      if (Object.keys(updates).length) this.filterStore.update(updates);
      this.loadCourses();
    });
  }

  ngOnDestroy(): void {
    this.mobileFilterDrawer.unregister();
  }

  protected loadCourses(append = false): void {
    if (append) {
      this.loadingMore.set(true);
    } else {
      this.loading.set(true);
    }
    this.error.set(null);

    this.courseService.getCourses(this.filters()).subscribe({
      next: (res) => {
        if (append) {
          this.courses.update((current) => [...current, ...res.data]);
        } else {
          this.courses.set(res.data);
        }
        this.total.set(res.meta.total);
        this.loading.set(false);
        this.loadingMore.set(false);
      },
      error: (err) => {
        this.error.set(err.friendlyMessage || 'Failed to load courses. Make sure the backend is running.');
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
      const key = event.sectionId as 'budgetRange';
      this.filterStore.update({ [key]: event.value });
      return;
    }

    const key = event.sectionId as 'category' | 'location' | 'ranking' | 'mode';
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
    this.loadCourses();
  }

  protected onApplyFilters(): void {
    this.filterStore.setPage(1);
    this.loadCourses();
  }

  protected onLoadMore(): void {
    if (!this.hasMore() || this.loading() || this.loadingMore()) return;
    const nextPage = (this.filters().page ?? 1) + 1;
    this.filterStore.setPage(nextPage);
    this.loadCourses(true);
  }

  protected onCompare(_course: Course): void {
    // Compare flow for courses — coming soon
  }
}
