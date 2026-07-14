import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../models';
import { StatusChip, StatusChipVariant } from '../status-chip/status-chip';

@Component({
  selector: 'app-course-card',
  imports: [RouterLink, StatusChip],
  templateUrl: './course-card.html',
  styleUrl: './course-card.scss',
})
export class CourseCard {
  readonly course = input.required<Course>();
  readonly index = input(0);

  readonly compare = output<Course>();

  protected demandLabel(): string {
    const map: Record<string, string> = {
      high_demand: 'High Demand',
      professional: 'Professional',
      rising_star: 'Rising Star',
    };
    return map[this.course().demandStatus] ?? this.course().demandStatus;
  }

  protected demandVariant(): StatusChipVariant {
    const map: Record<string, StatusChipVariant> = {
      high_demand: 'demand',
      professional: 'professional',
      rising_star: 'rising_star',
    };
    return map[this.course().demandStatus] ?? 'default';
  }

  protected careerPathsText(): string {
    return this.course().careerPaths.join(', ');
  }

  protected staggerDelay(): string {
    return `${this.index() * 60}ms`;
  }
}
