import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminLeadService } from '../../../core/admin/admin-lead.service';
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  Lead,
  LeadStatus,
} from '../../../shared/models/lead.model';

@Component({
  selector: 'app-lead-admin-list',
  imports: [FormsModule, DatePipe],
  templateUrl: './lead-admin-list.html',
  styleUrl: './lead-admin-list.scss',
})
export class LeadAdminList implements OnInit {
  private readonly adminService = inject(AdminLeadService);

  protected readonly leads = signal<Lead[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly statusFilter = signal<LeadStatus | ''>('');
  protected readonly managingLead = signal<Lead | null>(null);
  protected readonly editStatus = signal<LeadStatus>('new');
  protected readonly editRemarks = signal('');
  protected readonly saving = signal(false);

  protected readonly statusLabels = LEAD_STATUS_LABELS;
  protected readonly sourceLabels = LEAD_SOURCE_LABELS;
  protected readonly statusOptions: LeadStatus[] = [
    'new',
    'contacted',
    'qualified',
    'converted',
    'closed',
  ];

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    const status = this.statusFilter();
    this.adminService.getAll(status || undefined).subscribe({
      next: (data) => {
        this.leads.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load leads. Check your admin API key.');
        this.loading.set(false);
      },
    });
  }

  protected onFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as LeadStatus | '';
    this.statusFilter.set(value);
    this.load();
  }

  protected openManage(lead: Lead): void {
    this.managingLead.set(lead);
    this.editStatus.set(lead.status);
    this.editRemarks.set(lead.remarks || '');
  }

  protected closeManage(): void {
    this.managingLead.set(null);
  }

  protected saveLead(): void {
    const lead = this.managingLead();
    if (!lead) return;

    this.saving.set(true);
    this.adminService
      .update(lead._id, {
        status: this.editStatus(),
        remarks: this.editRemarks(),
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.closeManage();
          this.load();
        },
        error: () => {
          this.saving.set(false);
          this.error.set('Failed to update lead.');
        },
      });
  }

  protected deleteLead(lead: Lead): void {
    if (!confirm(`Delete lead from "${lead.fullName}"? This cannot be undone.`)) return;
    this.adminService.delete(lead._id).subscribe({ next: () => this.load() });
  }

  protected statusClass(status: LeadStatus): string {
    const map: Record<LeadStatus, string> = {
      new: 'bg-primary-container text-primary',
      contacted: 'bg-yellow-100 text-yellow-700',
      qualified: 'bg-purple-100 text-purple-700',
      converted: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-600',
    };
    return map[status];
  }
}
