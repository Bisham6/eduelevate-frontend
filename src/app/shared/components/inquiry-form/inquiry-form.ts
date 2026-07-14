import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inquiry-form',
  imports: [FormsModule],
  templateUrl: './inquiry-form.html',
  styleUrl: './inquiry-form.scss',
})
export class InquiryForm {
  readonly collegeName = input<string>('');

  readonly submitted = output<{ name: string; email: string }>();

  protected name = '';
  protected email = '';
  protected submittedLocal = signal(false);

  protected onSubmit(): void {
    if (!this.name.trim() || !this.email.trim()) return;
    this.submitted.emit({ name: this.name.trim(), email: this.email.trim() });
    this.submittedLocal.set(true);
    this.name = '';
    this.email = '';
  }
}
