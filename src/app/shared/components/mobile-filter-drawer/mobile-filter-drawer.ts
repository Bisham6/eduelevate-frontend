import { Component, HostListener, OnDestroy, inject } from '@angular/core';
import { MobileFilterDrawerService } from '../../../core/services/mobile-filter-drawer.service';
import { FilterSidebar } from '../filter-sidebar/filter-sidebar';
import { CourseFilterSidebar } from '../course-filter-sidebar/course-filter-sidebar';

@Component({
  selector: 'app-mobile-filter-drawer',
  imports: [FilterSidebar, CourseFilterSidebar],
  templateUrl: './mobile-filter-drawer.html',
  styleUrl: './mobile-filter-drawer.scss',
})
export class MobileFilterDrawer implements OnDestroy {
  protected readonly filterDrawer = inject(MobileFilterDrawerService);

  ngOnDestroy(): void {
    this.filterDrawer.close();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.filterDrawer.open()) {
      this.filterDrawer.close();
    }
  }

  protected close(): void {
    this.filterDrawer.close();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  protected onApply(): void {
    this.filterDrawer.apply();
  }
}
