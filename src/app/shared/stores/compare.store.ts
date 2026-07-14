import { Injectable, computed, signal } from '@angular/core';

const STORAGE_KEY = 'eduelevate_compare_ids';
const MAX_COMPARE = 3;

@Injectable({ providedIn: 'root' })
export class CompareStore {
  readonly collegeIds = signal<string[]>(this.loadFromStorage());

  readonly count = computed(() => this.collegeIds().length);
  readonly isFull = computed(() => this.collegeIds().length >= MAX_COMPARE);

  add(id: string): boolean {
    const current = this.collegeIds();
    if (current.includes(id)) return true;
    if (current.length >= MAX_COMPARE) return false;
    const updated = [...current, id];
    this.collegeIds.set(updated);
    this.saveToStorage(updated);
    return true;
  }

  remove(id: string): void {
    const updated = this.collegeIds().filter((cid) => cid !== id);
    this.collegeIds.set(updated);
    this.saveToStorage(updated);
  }

  setIds(ids: string[]): void {
    const trimmed = ids.slice(0, MAX_COMPARE);
    this.collegeIds.set(trimmed);
    this.saveToStorage(trimmed);
  }

  clear(): void {
    this.collegeIds.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  private loadFromStorage(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(ids: string[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }
}
