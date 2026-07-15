import { Injectable, computed, signal } from '@angular/core';
import { CollegeFilters } from '../models';

@Injectable({ providedIn: 'root' })
export class CollegeFilterStore {
  readonly filters = signal<CollegeFilters>({
    page: 1,
    limit: 6,
  });

  readonly activeFilterCount = computed(() => {
    const f = this.filters();
    let count = 0;
    if (f.category) count += 1;
    if (f.location?.length) count += f.location.length;
    if (f.feesRange) count += 1;
    if (f.nirfRanking?.length) count += f.nirfRanking.length;
    if (f.specialization?.length) count += f.specialization.length;
    return count;
  });

  update(partial: Partial<CollegeFilters>): void {
    this.filters.update((current) => ({ ...current, ...partial, page: partial.page ?? 1 }));
  }

  setPage(page: number): void {
    this.update({ page });
  }

  clearAll(): void {
    this.filters.set({ page: 1, limit: 6 });
  }
}
