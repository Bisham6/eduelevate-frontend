import { Component, input } from '@angular/core';

export type SkeletonVariant = 'card' | 'row' | 'text' | 'category' | 'hero' | 'circle';

@Component({
  selector: 'app-skeleton',
  imports: [],
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.scss',
})
export class Skeleton {
  readonly variant = input<SkeletonVariant>('text');
  readonly lines = input(3);
  readonly count = input(1);
}
