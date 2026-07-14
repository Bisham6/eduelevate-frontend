import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { College } from '../../models';
import { LeadCaptureService } from '../../services/lead-capture.service';
import { StatusChip } from '../status-chip/status-chip';

export type AcademicCardVariant = 'featured' | 'listing' | 'compact';

@Component({
  selector: 'app-academic-card',
  imports: [RouterLink, StatusChip],
  templateUrl: './academic-card.html',
  styleUrl: './academic-card.scss',
})
export class AcademicCard {
  private readonly leadCapture = inject(LeadCaptureService);

  readonly college = input.required<College>();
  readonly variant = input<AcademicCardVariant>('listing');
  readonly showCompare = input(true);

  readonly compare = output<College>();
  readonly save = output<College>();

  protected formatFees(min: number, max: number): string {
    const fmt = (n: number) => {
      if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
      return `₹${(n / 1000).toFixed(0)}K`;
    };
    return `${fmt(min)} - ${fmt(max)}`;
  }

  protected formatPackage(amount: number): string {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} LPA`;
    return `₹${amount.toLocaleString('en-IN')}`;
  }

  protected thumbnail(): string {
    const media = this.college().media;
    return (
      media.thumbnail ||
      media.hero ||
      'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=500&fit=crop'
    );
  }

  protected onApplyNow(): void {
    const college = this.college();
    this.leadCapture.open({
      collegeId: college._id,
      collegeName: college.name,
      source: 'apply_now',
    });
  }
}
