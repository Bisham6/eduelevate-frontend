import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { ExamService } from '../../shared/services/exam.service';
import { ExamFilterStore } from '../../shared/stores/exam-filter.store';
import { Exam, FilterSection } from '../../shared/models';
import {
  SectionHeader,
  SearchBar,
  FilterSidebar,
  ExamCard,
  Skeleton,
  EmptyState,
} from '../../shared/components';
import { InfiniteScrollDirective } from '../../shared/directives';
import { MobileFilterDrawerService } from '../../core/services/mobile-filter-drawer.service';

@Component({
  selector: 'app-exams',
  imports: [SectionHeader, SearchBar, FilterSidebar, ExamCard, Skeleton, EmptyState, InfiniteScrollDirective],
  templateUrl: './exams.html',
  styleUrl: './exams.scss',
})
export class Exams implements OnInit, OnDestroy {
  private readonly examService = inject(ExamService);
  private readonly filterStore = inject(ExamFilterStore);
  private readonly mobileFilterDrawer = inject(MobileFilterDrawerService);

  protected readonly exams = signal<Exam[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(true);
  protected readonly loadingMore = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly filters = this.filterStore.filters;
  protected readonly hasMore = computed(() => this.exams().length < this.total());
  protected readonly selectedFilters = computed(() => {
    const f = this.filters();
    return {
      category: f.category ?? [],
      difficulty: f.difficulty ?? [],
      examMode: f.examMode ?? [],
    };
  });

  protected readonly filterSections: FilterSection[] = [
    {
      id: 'category',
      title: 'Stream',
      type: 'checkbox',
      options: [
        { label: 'Engineering', value: 'engineering' },
        { label: 'Medical', value: 'medical' },
        { label: 'Management', value: 'management' },
        { label: 'Law', value: 'law' },
        { label: 'Civil Services', value: 'civil_services' },
      ],
    },
    {
      id: 'difficulty',
      title: 'Difficulty',
      type: 'checkbox',
      options: [
        { label: 'Easy', value: 'easy' },
        { label: 'Moderate', value: 'moderate' },
        { label: 'Hard', value: 'hard' },
        { label: 'Very Hard', value: 'very_hard' },
      ],
    },
    {
      id: 'examMode',
      title: 'Exam Mode',
      type: 'radio',
      options: [
        { label: 'Online', value: 'online' },
        { label: 'Offline', value: 'offline' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
    },
  ];

  ngOnInit(): void {
    this.mobileFilterDrawer.register({
      kind: 'standard',
      title: 'Refine Search',
      sections: () => this.filterSections,
      selectedValues: () => this.selectedFilters(),
      onValueChange: (event) => this.onFilterChange(event),
      onClearAll: () => this.onClearFilters(),
      onApply: () => this.onApplyFilters(),
    });

    this.loadExams();
  }

  ngOnDestroy(): void {
    this.mobileFilterDrawer.unregister();
  }

  protected loadExams(append = false): void {
    if (append) {
      this.loadingMore.set(true);
    } else {
      this.loading.set(true);
    }
    this.error.set(null);

    this.examService.getExams(this.filters()).subscribe({
      next: (res) => {
        if (append) {
          this.exams.update((current) => [...current, ...res.data]);
        } else {
          this.exams.set(res.data);
        }
        this.total.set(res.meta.total);
        this.loading.set(false);
        this.loadingMore.set(false);
      },
      error: (err) => {
        this.error.set(err.friendlyMessage || 'Failed to load exams. Make sure the backend is running.');
        this.loading.set(false);
        this.loadingMore.set(false);
      },
    });
  }

  protected onSearch(query: string): void {
    this.filterStore.update({ search: query || undefined });
    this.loadExams();
  }

  protected onFilterChange(event: {
    sectionId: string;
    value: string;
    checked: boolean;
    type: 'checkbox' | 'radio';
  }): void {
    const f = this.filters();

    if (event.type === 'radio') {
      this.filterStore.update({ examMode: [event.value] });
      return;
    }

    const key = event.sectionId as 'category' | 'difficulty';
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
    this.loadExams();
  }

  protected onApplyFilters(): void {
    this.filterStore.setPage(1);
    this.loadExams();
  }

  protected onLoadMore(): void {
    if (!this.hasMore() || this.loading() || this.loadingMore()) return;
    const nextPage = (this.filters().page ?? 1) + 1;
    this.filterStore.setPage(nextPage);
    this.loadExams(true);
  }
}
