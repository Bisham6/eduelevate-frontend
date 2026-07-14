import { Component, input, output } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { FilterSection } from '../../models';
import { COURSE_FILTER_ICONS } from '../../config/course-filter.config';

@Component({
  selector: 'app-course-filter-sidebar',
  imports: [MatExpansionModule],
  templateUrl: './course-filter-sidebar.html',
  styleUrl: './course-filter-sidebar.scss',
})
export class CourseFilterSidebar {
  readonly sections = input.required<FilterSection[]>();
  readonly selectedValues = input<Record<string, string[]>>({});
  readonly title = input('Refine Search');

  readonly valueChange = output<{ sectionId: string; value: string; checked: boolean; type: 'checkbox' | 'radio' }>();
  readonly clearAll = output<void>();
  readonly apply = output<void>();

  protected readonly icons = COURSE_FILTER_ICONS;

  protected sectionIcon(sectionId: string): string {
    return this.icons[sectionId] ?? 'tune';
  }

  protected isSelected(sectionId: string, value: string): boolean {
    return this.selectedValues()[sectionId]?.includes(value) ?? false;
  }

  protected onCheckboxChange(sectionId: string, value: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.valueChange.emit({ sectionId, value, checked, type: 'checkbox' });
  }

  protected onRadioChange(sectionId: string, value: string): void {
    this.valueChange.emit({ sectionId, value, checked: true, type: 'radio' });
  }
}
