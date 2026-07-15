import { Injectable, signal } from '@angular/core';
import { FilterSection } from '../../shared/models';

export type MobileFilterSidebarKind = 'standard' | 'course';

export interface MobileFilterChangeEvent {
  sectionId: string;
  value: string;
  checked: boolean;
  type: 'checkbox' | 'radio';
}

export interface MobileFilterDrawerConfig {
  kind: MobileFilterSidebarKind;
  title: string;
  sections: () => FilterSection[];
  selectedValues: () => Record<string, string[]>;
  onValueChange: (event: MobileFilterChangeEvent) => void;
  onClearAll: () => void;
  onApply: () => void;
}

@Injectable({ providedIn: 'root' })
export class MobileFilterDrawerService {
  readonly open = signal(false);
  readonly config = signal<MobileFilterDrawerConfig | null>(null);

  isListingFilterRoute(url: string): boolean {
    const path = url.split('?')[0];
    return path === '/colleges' || path === '/courses' || path === '/exams';
  }

  register(config: MobileFilterDrawerConfig): void {
    this.config.set(config);
  }

  unregister(): void {
    this.config.set(null);
    this.open.set(false);
    this.syncBodyScroll();
  }

  toggle(): void {
    if (!this.config()) return;
    this.open.update((v) => !v);
    this.syncBodyScroll();
  }

  close(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.syncBodyScroll();
  }

  apply(): void {
    const cfg = this.config();
    if (!cfg) return;
    cfg.onApply();
    this.close();
  }

  private syncBodyScroll(): void {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = this.open() ? 'hidden' : '';
  }
}
