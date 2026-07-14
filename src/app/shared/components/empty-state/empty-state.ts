import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  imports: [RouterLink],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  readonly icon = input('search_off');
  readonly title = input('No results found');
  readonly message = input('');
  readonly actionLabel = input('');
  readonly actionLink = input('');
}
