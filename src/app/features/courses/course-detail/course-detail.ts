import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../shared/services/course.service';
import { Course } from '../../../shared/models';
import { SeoService } from '../../../core/services/seo.service';
import { Breadcrumb, StatusChip, StatusChipVariant, CourseCard, Skeleton, EmptyState } from '../../../shared/components';

@Component({
  selector: 'app-course-detail',
  imports: [RouterLink, Breadcrumb, StatusChip, CourseCard, Skeleton, EmptyState, TitleCasePipe],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.scss',
})
export class CourseDetail implements OnInit {
  readonly slug = input<string>('');

  private readonly courseService = inject(CourseService);
  private readonly seo = inject(SeoService);

  protected readonly course = signal<Course | null>(null);
  protected readonly similarCourses = signal<Course[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCourse();
  }

  protected loadCourse(): void {
    const slug = this.slug();
    if (!slug) return;

    this.loading.set(true);
    this.courseService.getBySlug(slug).subscribe({
      next: (data) => {
        this.course.set(data);
        this.loading.set(false);
        this.seo.update({
          title: data.title,
          description: data.about?.slice(0, 160) || data.description,
          keywords: `${data.title}, ${data.category}, career paths, ${data.avgSalary}`,
        });
        this.loadSimilar(slug);
      },
      error: () => {
        this.error.set('Course not found.');
        this.loading.set(false);
      },
    });
  }

  private loadSimilar(slug: string): void {
    this.courseService.getSimilar(slug, 3).subscribe({
      next: (data) => this.similarCourses.set(data),
    });
  }

  protected demandLabel(c: Course): string {
    const map: Record<string, string> = {
      high_demand: 'High Demand',
      professional: 'Professional',
      rising_star: 'Rising Star',
    };
    return map[c.demandStatus] ?? c.demandStatus;
  }

  protected demandVariant(c: Course): StatusChipVariant {
    const map: Record<string, StatusChipVariant> = {
      high_demand: 'demand',
      professional: 'professional',
      rising_star: 'rising_star',
    };
    return map[c.demandStatus] ?? 'default';
  }

  protected breadcrumbs() {
    const c = this.course();
    if (!c) return [{ label: 'Home', path: '/' }, { label: 'Courses', path: '/courses' }];
    return [
      { label: 'Home', path: '/' },
      { label: 'Courses', path: '/courses' },
      { label: c.title },
    ];
  }
}
