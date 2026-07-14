import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AdminCollegeService } from '../../../core/admin/admin-college.service';
import { College } from '../../../shared/models';

@Component({
  selector: 'app-college-admin-list',
  imports: [RouterLink],
  templateUrl: './college-admin-list.html',
  styleUrl: './college-admin-list.scss',
})
export class CollegeAdminList implements OnInit {
  private readonly adminService = inject(AdminCollegeService);
  private readonly router = inject(Router);

  protected readonly colleges = signal<College[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.adminService.getAll().subscribe({
      next: (data) => {
        this.colleges.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load colleges. Check your admin API key.');
        this.loading.set(false);
      },
    });
  }

  protected togglePublish(college: College): void {
    const action = college.isPublished
      ? this.adminService.unpublish(college._id)
      : this.adminService.publish(college._id);

    action.subscribe({ next: () => this.load() });
  }

  protected deleteCollege(college: College): void {
    if (!confirm(`Delete "${college.name}"? This cannot be undone.`)) return;
    this.adminService.delete(college._id).subscribe({ next: () => this.load() });
  }

  protected editCollege(id: string): void {
    this.router.navigate(['/admin/colleges', id, 'edit']);
  }
}
