import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { College } from '../../shared/models';
import { AdminAuthStore } from '../admin/admin-auth.store';

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
  private readonly auth = inject(AdminAuthStore);
  private readonly baseUrl = `${environment.apiUrl}/admin/colleges`;

  private headers(): HttpHeaders {
    return new HttpHeaders({ 'x-admin-key': this.auth.getKey() });
  }

  getAll(): Observable<College[]> {
    return this.http.get<College[]>(this.baseUrl, { headers: this.headers() });
  }

  getById(id: string): Observable<College> {
    return this.http.get<College>(`${this.baseUrl}/${id}`, { headers: this.headers() });
  }

  create(payload: CreateCollegePayload): Observable<College> {
    return this.http.post<College>(this.baseUrl, payload, { headers: this.headers() });
  }

  update(id: string, payload: Partial<CreateCollegePayload>): Observable<College> {
    return this.http.patch<College>(`${this.baseUrl}/${id}`, payload, { headers: this.headers() });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.headers() });
  }

  publish(id: string): Observable<College> {
    return this.http.post<College>(`${this.baseUrl}/${id}/publish`, {}, { headers: this.headers() });
  }

  unpublish(id: string): Observable<College> {
    return this.http.post<College>(`${this.baseUrl}/${id}/unpublish`, {}, { headers: this.headers() });
  }
}
