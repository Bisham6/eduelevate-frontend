import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeadService } from '../../services/lead.service';

@Component({
  selector: 'app-inquiry-form',
  imports: [FormsModule],
  templateUrl: './inquiry-form.html',
  styleUrl: './inquiry-form.scss',
})
export class InquiryForm {
  private readonly leadService = inject(LeadService);

  readonly collegeId = input<string>('');
  readonly collegeName = input<string>('');

  protected name = '';
  protected email = '';
  protected phone = '';
  protected submittedLocal = signal(false);
  protected loading = signal(false);
  protected error = signal<string | null>(null);
  protected phoneError = signal<string | null>(null);

  protected onSubmit(): void {
    this.error.set(null);
    this.phoneError.set(null);

    const fullName = this.name.trim();
    const email = this.email.trim();
    const phone = this.phone.trim().replace(/\D/g, '');

    if (!fullName || !email || !phone) {
      this.error.set('Please fill in all fields.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      this.phoneError.set('Enter a valid 10-digit Indian mobile number.');
      return;
    }

    this.loading.set(true);

    this.leadService
      .submitLead({
        fullName,
        email,
        phone,
        collegeId: this.collegeId() || undefined,
        collegeName: this.collegeName() || undefined,
        source: 'inquiry_form',
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.submittedLocal.set(true);
          this.name = '';
          this.email = '';
          this.phone = '';
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.error?.message || 'Failed to submit inquiry. Please try again.');
        },
      });
  }
}
