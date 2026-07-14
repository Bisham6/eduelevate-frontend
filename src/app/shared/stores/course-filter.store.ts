import { Injectable, computed, signal } from '@angular/core';
import { CourseFilters, CourseSortOption } from '../models';

@Injectable({ providedIn: 'root' })
export class CourseFilterStore {
  readonly filters = signal<CourseFilters>({
    page: 1,
    limit: 6,
    sort: 'popularity',
  });

  readonly activeFilterCount = computed(() => {
    const f = this.filters();
    let count = 0;
    if (f.category?.length) count += f.category.length;
    if (f.location?.length) count += f.location.length;
    if (f.budgetRange) count += 1;
    if (f.ranking?.length) count += f.ranking.length;
    if (f.mode?.length) count += f.mode.length;
    return count;
  });

  update(partial: Partial<CourseFilters>): void {
    this.filters.update((current) => ({ ...current, ...partial, page: partial.page ?? 1 }));
  }

  setSort(sort: CourseSortOption): void {
    this.update({ sort, page: 1 });
  }

  setPage(page: number): void {
    this.update({ page });
  }

  clearAll(): void {
    this.filters.set({ page: 1, limit: 6, sort: 'popularity' });
  }
}
