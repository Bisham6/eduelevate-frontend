import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { College } from '../../shared/models';

export interface CreateCollegePayload {
  name: string;
  slug?: string;
  shortName?: string;
  type?: string;
  established?: number;
  location: { city: string; state: string; country?: string; address?: string };
  category: string;
  categorySlug?: string;
  nirfRank?: number;
  rating?: { average?: number; count?: number };
  media?: { logo?: string; hero?: string; thumbnail?: string; gallery?: string[] };
  stats: {
    avgFeesMin: number;
    avgFeesMax: number;
    avgPackage: number;
    highestPackage?: number;
    campusSize?: string;
    studentCount?: number;
    facultyCount?: number;
  };
  infrastructure?: string[];
  specializations?: string[];
  about?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminCollegeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/admin/colleges`;

  getAll(): Observable<College[]> {
    return this.http.get<College[]>(this.baseUrl);
  }

  getById(id: string): Observable<College> {
    return this.http.get<College>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateCollegePayload): Observable<College> {
    return this.http.post<College>(this.baseUrl, payload);
  }

  update(id: string, payload: Partial<CreateCollegePayload>): Observable<College> {
    return this.http.patch<College>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  publish(id: string): Observable<College> {
    return this.http.post<College>(`${this.baseUrl}/${id}/publish`, {});
  }

  unpublish(id: string): Observable<College> {
    return this.http.post<College>(`${this.baseUrl}/${id}/unpublish`, {});
  }
}
