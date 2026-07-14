import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CollegeService } from '../../../shared/services/college.service';
import { LeadCaptureService } from '../../../shared/services/lead-capture.service';
import { CompareStore } from '../../../shared/stores/compare.store';
import { College } from '../../../shared/models';
import { SeoService } from '../../../core/services/seo.service';
import {
  Breadcrumb,
  StatusChip,
  StatCard,
  InquiryForm,
  AcademicCard,
  Skeleton,
} from '../../../shared/components';

type DetailTab = 'overview' | 'courses' | 'placements' | 'admission' | 'reviews' | 'infrastructure';

@Component({
  selector: 'app-college-detail',
  imports: [RouterLink, Breadcrumb, StatusChip, StatCard, InquiryForm, AcademicCard, Skeleton, DecimalPipe, TitleCasePipe],
  templateUrl: './college-detail.html',
  styleUrl: './college-detail.scss',
})
export class CollegeDetail implements OnInit {
  readonly slug = input<string>('');

  private readonly collegeService = inject(CollegeService);
  private readonly leadCapture = inject(LeadCaptureService);
  private readonly compareStore = inject(CompareStore);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  protected readonly college = signal<College | null>(null);
  protected readonly similarColleges = signal<College[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly activeTab = signal<DetailTab>('overview');

  protected readonly tabs: { id: DetailTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'courses', label: 'Courses & Fees' },
    { id: 'placements', label: 'Placements' },
    { id: 'admission', label: 'Admission' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'infrastructure', label: 'Infrastructure' },
  ];

  ngOnInit(): void {
    this.loadCollege();
  }

  protected loadCollege(): void {
    const slug = this.slug();
    if (!slug) return;

    this.loading.set(true);
    this.collegeService.getBySlug(slug).subscribe({
      next: (data) => {
        this.college.set(data);
        this.loading.set(false);
        this.seo.update({
          title: data.name,
          description: data.about?.slice(0, 160) || `${data.name} — fees, placements, NIRF rank, and admission details on EduElevate.`,
          keywords: `${data.name}, ${data.category}, ${data.location.city}, college admission`,
        });
        this.loadSimilar(slug);
      },
      error: () => {
        this.error.set('College not found.');
        this.loading.set(false);
      },
    });
  }

  private loadSimilar(slug: string): void {
    this.collegeService.getSimilar(slug, 3).subscribe({
      next: (data) => this.similarColleges.set(data),
    });
  }

  protected setTab(tab: DetailTab): void {
    this.activeTab.set(tab);
  }

  protected heroImage(): string {
    const c = this.college();
    return c?.media.hero || c?.media.thumbnail || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&h=600&fit=crop';
  }

  protected formatFees(min: number, max: number): string {
    const fmt = (n: number) => `₹${(n / 100000).toFixed(1)}L`;
    return `${fmt(min)} - ${fmt(max)}`;
  }

  protected formatPackage(amount: number): string {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    return `₹${(amount / 100000).toFixed(1)} LPA`;
  }

  protected onCompare(c: College): void {
    if (this.compareStore.add(c._id)) {
      this.router.navigate(['/compare']);
    }
  }

  protected onApplyNow(): void {
    const c = this.college();
    if (!c) return;
    this.leadCapture.open({
      collegeId: c._id,
      collegeName: c.name,
      source: 'apply_now',
    });
  }
}
