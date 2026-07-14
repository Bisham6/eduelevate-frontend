import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CollegeService } from '../../../shared/services/college.service';
import { LeadCaptureService } from '../../../shared/services/lead-capture.service';
import { CompareStore } from '../../../shared/stores/compare.store';
import { College } from '../../../shared/models';
import { Breadcrumb, SectionHeader } from '../../../shared/components';

interface CompareMetric {
  icon: string;
  label: string;
  values: string[];
}

@Component({
  selector: 'app-compare-colleges',
  imports: [RouterLink, Breadcrumb, SectionHeader],
  templateUrl: './compare-colleges.html',
  styleUrl: './compare-colleges.scss',
})
export class CompareColleges implements OnInit {
  private readonly collegeService = inject(CollegeService);
  private readonly leadCapture = inject(LeadCaptureService);
  private readonly compareStore = inject(CompareStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly colleges = signal<College[]>([]);
  protected readonly loading = signal(true);
  protected readonly allColleges = signal<College[]>([]);

  protected readonly metrics = computed(() => this.buildMetrics(this.colleges()));

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const idsParam = params['ids'] as string | undefined;
      if (idsParam) {
        const ids = idsParam.split(',').filter(Boolean);
        this.compareStore.setIds([...this.compareStore.collegeIds(), ...ids].slice(0, 3));
      }
      this.loadCompare();
    });

    this.collegeService.getColleges({ limit: 20 }).subscribe({
      next: (res) => this.allColleges.set(res.data),
    });
  }

  protected loadCompare(): void {
    const ids = this.compareStore.collegeIds();
    if (!ids.length) {
      this.colleges.set([]);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.collegeService.compare(ids).subscribe({
      next: (data) => {
        this.colleges.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected removeCollege(id: string): void {
    this.compareStore.remove(id);
    this.loadCompare();
  }

  protected addCollege(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const id = select.value;
    if (!id) return;
    if (this.compareStore.add(id)) {
      this.loadCompare();
      select.value = '';
    }
  }

  protected formatFees(c: College): string {
    return `₹${(c.stats.avgFeesMin / 100000).toFixed(1)} - ${(c.stats.avgFeesMax / 100000).toFixed(1)} Lakhs`;
  }

  protected formatPackage(amount: number): string {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    return `₹${(amount / 100000).toFixed(1)} LPA`;
  }

  protected maxPackage(): number {
    return Math.max(...this.colleges().map((c) => c.stats.avgPackage), 1);
  }

  protected feePercent(c: College): number {
    const max = Math.max(...this.colleges().map((x) => x.stats.avgFeesMax), 1);
    return (c.stats.avgFeesMax / max) * 100;
  }

  protected isInCompare(id: string): boolean {
    return this.colleges().some((c) => c._id === id);
  }

  protected onApplyNow(college: College): void {
    this.leadCapture.open({
      collegeId: college._id,
      collegeName: college.name,
      source: 'compare',
    });
  }

  private buildMetrics(cols: College[]): CompareMetric[] {
    if (!cols.length) return [];

    return [
      {
        icon: 'emoji_events',
        label: 'NIRF Ranking',
        values: cols.map((c) => (c.nirfRank ? `#${c.nirfRank}` : 'N/A')),
      },
      {
        icon: 'payments',
        label: 'Total Fees',
        values: cols.map((c) => this.formatFees(c)),
      },
      {
        icon: 'rocket_launch',
        label: 'Highest Package',
        values: cols.map((c) =>
          c.stats.highestPackage ? this.formatPackage(c.stats.highestPackage) : 'N/A',
        ),
      },
      {
        icon: 'trending_up',
        label: 'Avg Package',
        values: cols.map((c) => this.formatPackage(c.stats.avgPackage)),
      },
      {
        icon: 'apartment',
        label: 'Infrastructure',
        values: cols.map((c) => (c.infrastructure?.slice(0, 2).join(', ') || c.stats.campusSize || 'N/A')),
      },
    ];
  }
}
