import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq-accordion',
  imports: [],
  templateUrl: './faq-accordion.html',
  styleUrl: './faq-accordion.scss',
})
export class FaqAccordion {
  readonly items = input.required<FaqItem[]>();
  readonly openIndex = signal<number | null>(0);

  protected toggle(index: number): void {
    this.openIndex.update((current) => (current === index ? null : index));
  }
}
