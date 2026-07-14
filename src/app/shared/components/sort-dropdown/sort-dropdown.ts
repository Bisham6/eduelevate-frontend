import { Component, input, output } from '@angular/core';

export interface SortOption<T extends string = string> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-sort-dropdown',
  imports: [],
  templateUrl: './sort-dropdown.html',
  styleUrl: './sort-dropdown.scss',
})
export class SortDropdown<T extends string = string> {
  readonly options = input.required<SortOption<T>[]>();
  readonly value = input.required<T>();
  readonly label = input('Sort by');

  readonly sortChange = output<T>();

  protected onChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as T;
    this.sortChange.emit(value);
  }
}
