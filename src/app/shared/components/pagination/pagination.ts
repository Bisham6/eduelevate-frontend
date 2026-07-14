import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  readonly total = input.required<number>();
  readonly page = input.required<number>();
  readonly pageSize = input(12);

  readonly pageChange = output<number>();

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.total() / this.pageSize())),
  );

  protected readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    const range: number[] = [];

    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);

    for (let i = start; i <= end; i++) range.push(i);
    return range;
  });

  protected goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.page()) {
      this.pageChange.emit(page);
    }
  }
}
