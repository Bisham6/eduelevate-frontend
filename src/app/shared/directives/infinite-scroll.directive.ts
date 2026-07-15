import {
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  input,
  output,
  effect,
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScrollDirective implements OnDestroy {
  private readonly element = inject(ElementRef<HTMLElement>);

  readonly disabled = input(false);
  readonly loadMore = output<void>();

  private observer: IntersectionObserver | null = null;

  constructor() {
    effect(() => {
      const isDisabled = this.disabled();
      if (isDisabled) {
        this.disconnect();
      } else {
        this.observe();
      }
    });
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  private observe(): void {
    if (typeof IntersectionObserver === 'undefined') return;

    this.disconnect();

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !this.disabled()) {
          this.loadMore.emit();
        }
      },
      { rootMargin: '200px' },
    );

    this.observer.observe(this.element.nativeElement);
  }

  private disconnect(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}
