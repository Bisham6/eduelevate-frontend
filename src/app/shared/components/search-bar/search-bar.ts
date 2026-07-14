import { Component, input, output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar implements OnInit {
  readonly placeholder = input('Search...');
  readonly value = input('');
  readonly showButton = input(true);
  readonly buttonLabel = input('Search');
  readonly ariaLabel = input('Search');

  readonly search = output<string>();

  protected query = '';

  ngOnInit(): void {
    this.query = this.value();
  }

  protected onSubmit(): void {
    this.search.emit(this.query.trim());
  }
}
