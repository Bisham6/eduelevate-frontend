import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-section-header',
  imports: [RouterLink],
  templateUrl: './section-header.html',
  styleUrl: './section-header.scss',
})
export class SectionHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly badge = input<string>('');
  readonly actionLabel = input<string>('');
  readonly actionLink = input<string>('');
  readonly actionClicked = output<void>();
}
