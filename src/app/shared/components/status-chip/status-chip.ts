import { Component, input } from '@angular/core';

export type StatusChipVariant = 'nirf' | 'demand' | 'placement' | 'default' | 'professional' | 'rising_star';

@Component({
  selector: 'app-status-chip',
  imports: [],
  templateUrl: './status-chip.html',
  styleUrl: './status-chip.scss',
})
export class StatusChip {
  readonly label = input.required<string>();
  readonly variant = input<StatusChipVariant>('default');
}
