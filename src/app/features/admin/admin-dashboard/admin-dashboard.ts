import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminCollegeService } from '../../../core/admin/admin-college.service';
import { AdminLeadService } from '../../../core/admin/admin-lead.service';
import { College } from '../../../shared/models';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  private readonly adminService = inject(AdminCollegeService);
  private readonly adminLeadService = inject(AdminLeadService);

  protected readonly colleges = signal<College[]>([]);
  protected readonly stats = signal({
    total: 0,
    published: 0,
    draft: 0,
    featured: 0,
    newLeads: 0,
  });

  ngOnInit(): void {
    this.adminService.getAll().subscribe({
      next: (data) => {
        this.colleges.set(data);
        this.stats.update((s) => ({
          ...s,
          total: data.length,
          published: data.filter((c) => c.isPublished).length,
          draft: data.filter((c) => !c.isPublished).length,
          featured: data.filter((c) => c.isFeatured).length,
        }));
      },
    });

    this.adminLeadService.getAll('new').subscribe({
      next: (leads) => {
        this.stats.update((s) => ({ ...s, newLeads: leads.length }));
      },
    });
  }
}
