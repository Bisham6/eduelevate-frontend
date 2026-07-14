import { Component, input, output } from '@angular/core';
import { Exam } from '../../models';
import { StatusChip } from '../status-chip/status-chip';

@Component({
  selector: 'app-exam-card',
  imports: [StatusChip],
  templateUrl: './exam-card.html',
  styleUrl: './exam-card.scss',
})
export class ExamCard {
  readonly exam = input.required<Exam>();

  readonly register = output<Exam>();

  protected categoryLabel(): string {
    return this.exam().category.replace('_', ' ').toUpperCase();
  }

  protected categoryVariant(): 'nirf' | 'demand' | 'placement' | 'default' {
    const map: Record<string, 'nirf' | 'demand' | 'placement' | 'default'> = {
      engineering: 'nirf',
      medical: 'demand',
      management: 'placement',
      law: 'default',
      civil_services: 'default',
    };
    return map[this.exam().category] ?? 'default';
  }

  protected difficultyColor(): string {
    const map: Record<string, string> = {
      easy: 'bg-green-500',
      moderate: 'bg-yellow-500',
      hard: 'bg-orange-500',
      very_hard: 'bg-red-500',
    };
    return map[this.exam().difficulty] ?? 'bg-gray-400';
  }

  protected formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
