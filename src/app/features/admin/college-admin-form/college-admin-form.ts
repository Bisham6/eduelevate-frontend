import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminCollegeService, CreateCollegePayload } from '../../../core/admin/admin-college.service';
import { MediaUploadService, ImageType } from '../../../core/admin/media-upload.service';
import { MediaUpload } from '../../../shared/components/media-upload/media-upload';
import { College } from '../../../shared/models';

@Component({
  selector: 'app-college-admin-form',
  imports: [RouterLink, FormsModule, MediaUpload],
  templateUrl: './college-admin-form.html',
  styleUrl: './college-admin-form.scss',
})
export class CollegeAdminForm implements OnInit {
  readonly id = input<string>('');

  private readonly adminService = inject(AdminCollegeService);
  private readonly mediaService = inject(MediaUploadService);
  private readonly router = inject(Router);

  protected readonly isEdit = signal(false);
  protected readonly saving = signal(false);
  protected readonly uploading = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly success = signal<string | null>(null);

  protected form: CreateCollegePayload = this.emptyForm();
  protected mediaUrls = { logo: '', hero: '', thumbnail: '', gallery: [] as string[] };
  protected infraInput = '';
  protected specInput = '';

  private pendingFiles: Partial<Record<ImageType, File>> = {};

  ngOnInit(): void {
    const id = this.id();
    if (id && id !== 'new') {
      this.isEdit.set(true);
      this.adminService.getById(id).subscribe({
        next: (college) => this.populateForm(college),
        error: () => this.error.set('College not found'),
      });
    }
  }

  protected onFileSelected(type: ImageType, file: File): void {
    this.pendingFiles[type] = file;
  }

  protected save(): void {
    this.saving.set(true);
    this.error.set(null);

    const payload = this.buildPayload();
    const request = this.isEdit()
      ? this.adminService.update(this.id(), payload)
      : this.adminService.create(payload);

    request.subscribe({
      next: async (college) => {
        await this.uploadPendingMedia(college._id, college.slug);
        this.saving.set(false);
        this.success.set('College saved successfully!');
        setTimeout(() => this.router.navigate(['/admin/colleges']), 1200);
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err.error?.message || 'Failed to save college');
      },
    });
  }

  protected saveDraft(): void {
    this.form.isPublished = false;
    this.save();
  }

  protected saveAndPublish(): void {
    this.form.isPublished = true;
    this.save();
  }

  protected addInfra(): void {
    if (!this.infraInput.trim()) return;
    this.form.infrastructure = [...(this.form.infrastructure || []), this.infraInput.trim()];
    this.infraInput = '';
  }

  protected addSpec(): void {
    if (!this.specInput.trim()) return;
    this.form.specializations = [...(this.form.specializations || []), this.specInput.trim()];
    this.specInput = '';
  }

  protected removeGalleryUrl(url: string): void {
    if (this.isEdit()) {
      this.mediaService.removeGalleryImage(this.id(), url).subscribe({
        next: () => {
          this.mediaUrls.gallery = this.mediaUrls.gallery.filter((g) => g !== url);
        },
      });
    } else {
      this.mediaUrls.gallery = this.mediaUrls.gallery.filter((g) => g !== url);
    }
  }

  private async uploadPendingMedia(collegeId: string, slug: string): Promise<void> {
    const entries = Object.entries(this.pendingFiles) as [ImageType, File][];
    for (const [type, file] of entries) {
      if (!file) continue;
      this.uploading.set(type);
      await new Promise<void>((resolve, reject) => {
        this.mediaService
          .upload(file, {
            entityType: 'colleges',
            entitySlug: slug,
            imageType: type,
            collegeId,
          })
          .subscribe({ next: () => resolve(), error: () => reject() });
      });
    }
    this.uploading.set(null);
    this.pendingFiles = {};
  }

  private populateForm(college: College): void {
    this.form = {
      name: college.name,
      slug: college.slug,
      shortName: college.shortName,
      type: college.type,
      established: college.established,
      location: { ...college.location },
      category: college.category,
      categorySlug: college.categorySlug,
      nirfRank: college.nirfRank,
      rating: college.rating,
      stats: { ...college.stats },
      infrastructure: college.infrastructure || [],
      specializations: [],
      about: college.about,
      isFeatured: college.isFeatured,
      isPublished: college.isPublished,
    };
    this.mediaUrls = {
      logo: college.media.logo || '',
      hero: college.media.hero || '',
      thumbnail: college.media.thumbnail || '',
      gallery: college.media.gallery || [],
    };
  }

  private buildPayload(): CreateCollegePayload {
    return {
      ...this.form,
      media: {
        logo: this.mediaUrls.logo || undefined,
        hero: this.mediaUrls.hero || undefined,
        thumbnail: this.mediaUrls.thumbnail || undefined,
        gallery: this.mediaUrls.gallery,
      },
    };
  }

  private emptyForm(): CreateCollegePayload {
    return {
      name: '',
      location: { city: '', state: '', country: 'India' },
      category: 'Engineering',
      categorySlug: 'engineering',
      stats: { avgFeesMin: 0, avgFeesMax: 0, avgPackage: 0 },
      infrastructure: [],
      specializations: [],
      isFeatured: false,
      isPublished: false,
    };
  }
}
