import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { LeadCaptureContext } from '../../models/lead.model';
import { LeadService } from '../../services/lead.service';

@Component({
  selector: 'app-lead-capture-dialog',
  imports: [FormsModule, MatDialogModule],
  templateUrl: './lead-capture-dialog.html',
  styleUrl: './lead-capture-dialog.scss',
})
export class LeadCaptureDialog {
  private readonly dialogRef = inject(MatDialogRef<LeadCaptureDialog>);
  private readonly leadService = inject(LeadService);
  protected readonly context = inject<LeadCaptureContext>(MAT_DIALOG_DATA);

  protected fullName = '';
  protected email = '';
  protected phone = '';
  protected loading = signal(false);
  protected submitted = signal(false);
  protected error = signal<string | null>(null);
  protected phoneError = signal<string | null>(null);

  protected close(): void {
    this.dialogRef.close();
  }

  protected onSubmit(): void {
    this.error.set(null);
    this.phoneError.set(null);

    const name = this.fullName.trim();
    const email = this.email.trim();
    const phone = this.phone.trim().replace(/\D/g, '');

    if (!name || !email || !phone) {
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
        fullName: name,
        email,
        phone,
        collegeId: this.context.collegeId,
        collegeName: this.context.collegeName,
        source: this.context.source,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.submitted.set(true);
          setTimeout(() => this.dialogRef.close(true), 2000);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.error?.message || 'Something went wrong. Please try again.');
        },
      });
  }
}
