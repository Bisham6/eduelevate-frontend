import { Component, input, output, OnInit } from '@angular/core';
import { FilterSection } from '../../models';

@Component({
  selector: 'app-filter-sidebar',
  imports: [],
  templateUrl: './filter-sidebar.html',
  styleUrl: './filter-sidebar.scss',
})
export class FilterSidebar implements OnInit {
  readonly sections = input.required<FilterSection[]>();
  readonly selectedValues = input<Record<string, string[]>>({});
  readonly title = input('Filters');

  readonly valueChange = output<{ sectionId: string; value: string; checked: boolean; type: 'checkbox' | 'radio' }>();
  readonly clearAll = output<void>();
  readonly apply = output<void>();

  protected expandedSections = new Set<string>();

  ngOnInit(): void {
    this.sections().forEach((s) => this.expandedSections.add(s.id));
  }

  protected isExpanded(sectionId: string): boolean {
    return this.expandedSections.has(sectionId);
  }

  protected toggleSection(sectionId: string): void {
    if (this.expandedSections.has(sectionId)) {
      this.expandedSections.delete(sectionId);
    } else {
      this.expandedSections.add(sectionId);
    }
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
