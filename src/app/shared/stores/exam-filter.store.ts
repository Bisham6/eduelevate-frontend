import { Injectable, computed, signal } from '@angular/core';
import { ExamFilters, ExamSortOption } from '../models';

@Injectable({ providedIn: 'root' })
export class ExamFilterStore {
  readonly filters = signal<ExamFilters>({
    page: 1,
    limit: 8,
    sort: 'exam_date_asc',
  });

  readonly activeFilterCount = computed(() => {
    const f = this.filters();
    let count = 0;
    if (f.category?.length) count += f.category.length;
    if (f.difficulty?.length) count += f.difficulty.length;
    if (f.examMode?.length) count += f.examMode.length;
    return count;
  });

  update(partial: Partial<ExamFilters>): void {
    this.filters.update((current) => ({ ...current, ...partial, page: partial.page ?? 1 }));
  }

  setSort(sort: ExamSortOption): void {
    this.update({ sort, page: 1 });
  }

  setPage(page: number): void {
    this.update({ page });
  }

  clearAll(): void {
    this.filters.set({ page: 1, limit: 8, sort: 'exam_date_asc' });
  }
}
