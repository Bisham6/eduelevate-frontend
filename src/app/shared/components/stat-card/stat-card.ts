import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  imports: [],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
})
export class StatCard {
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly value = input.required<string>();
}
