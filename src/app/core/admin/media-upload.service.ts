import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type ImageType = 'logo' | 'hero' | 'thumbnail' | 'gallery';

export interface UploadResult {
  url: string;
  asset: {
    filename: string;
    url: string;
    imageType: string;
  };
}

@Injectable({ providedIn: 'root' })
export class MediaUploadService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/admin/media`;

  upload(
    file: File,
    options: {
      entityType: string;
      entitySlug: string;
      imageType: ImageType;
      alt?: string;
      collegeId?: string;
    },
  ): Observable<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', options.entityType);
    formData.append('entitySlug', options.entitySlug);
    formData.append('imageType', options.imageType);
    if (options.alt) formData.append('alt', options.alt);
    if (options.collegeId) formData.append('collegeId', options.collegeId);

    return this.http.post<UploadResult>(`${this.baseUrl}/upload`, formData);
  }

  removeGalleryImage(collegeId: string, url: string): Observable<unknown> {
    return this.http.patch(`${this.baseUrl}/colleges/${collegeId}/gallery`, { url });
  }
}
