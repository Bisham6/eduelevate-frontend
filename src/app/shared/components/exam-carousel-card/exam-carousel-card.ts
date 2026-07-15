import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Exam, ExamCategory } from '../../models';

@Component({
  selector: 'app-exam-carousel-card',
  imports: [RouterLink],
  templateUrl: './exam-carousel-card.html',
  styleUrl: './exam-carousel-card.scss',
})
export class ExamCarouselCard {
  readonly exam = input.required<Exam>();

  protected categoryLabel(): string {
    const map: Record<ExamCategory, string> = {
      engineering: 'NATIONAL',
      medical: 'MEDICAL',
      management: 'MANAGEMENT',
      law: 'LAW',
      civil_services: 'CIVIL SERVICES',
    };
    return map[this.exam().category] ?? this.exam().category.toUpperCase();
  }

  protected formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }

  protected description(): string {
    const tip = this.exam().prepTip;
    if (tip) return tip.length > 90 ? tip.slice(0, 87) + '...' : tip;
    return `Registration closes ${this.formatDate(this.exam().registrationEnd)}. Prepare for ${this.exam().name}.`;
  }
}
