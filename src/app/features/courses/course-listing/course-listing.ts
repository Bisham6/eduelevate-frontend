import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../shared/services/course.service';
import { CourseFilterStore } from '../../../shared/stores/course-filter.store';
import { Course, CourseFilters, CourseSortOption } from '../../../shared/models';
import {
  CourseFilterSidebar,
  CourseCard,
  Pagination,
  Skeleton,
  EmptyState,
  SortDropdown,
} from '../../../shared/components';
import { COURSE_FILTER_SECTIONS, COURSE_SORT_OPTIONS } from '../../../shared/config/course-filter.config';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-course-listing',
  imports: [CourseFilterSidebar, CourseCard, Pagination, Skeleton, EmptyState, SortDropdown],
  templateUrl: './course-listing.html',
  styleUrl: './course-listing.scss',
})
export class CourseListing implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly filterStore = inject(CourseFilterStore);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  protected readonly courses = signal<Course[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly filters = this.filterStore.filters;
  protected readonly filterSections = COURSE_FILTER_SECTIONS;
  protected readonly sortOptions = COURSE_SORT_OPTIONS;

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

  constructor() {
    effect(() => {
      this.seo.update({
        title: 'Explore Trending Courses',
        description: 'Browse UG, PG, and professional courses across Engineering, Medical, MBA, Law, and Design on CollegeChuniye.',
        keywords: 'courses, B.Tech, MBBS, MBA, LLB, career paths, salary',
      });
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const updates: Partial<CourseFilters> = {};
      if (params['search']) updates.search = params['search'];
      if (Object.keys(updates).length) this.filterStore.update(updates);
      this.loadCourses();
    });
  }

  protected loadCourses(): void {
    this.loading.set(true);
    this.error.set(null);

    this.courseService.getCourses(this.filters()).subscribe({
      next: (res) => {
        this.courses.set(res.data);
        this.total.set(res.meta.total);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.friendlyMessage || 'Failed to load courses. Make sure the backend is running.');
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
    this.loadCourses();
  }

  protected onSortChange(sort: CourseSortOption): void {
    this.filterStore.setSort(sort);
    this.loadCourses();
  }

  protected onPageChange(page: number): void {
    this.filterStore.setPage(page);
    this.loadCourses();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected onCompare(_course: Course): void {
    // Compare flow for courses — coming soon
  }
}
