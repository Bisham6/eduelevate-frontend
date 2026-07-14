import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { College, CollegeFilters, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class CollegeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/colleges`;

  getColleges(filters: CollegeFilters = {}): Observable<PaginatedResponse<College>> {
    let params = new HttpParams();

    if (filters.search) params = params.set('search', filters.search);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.feesRange) params = params.set('feesRange', filters.feesRange);
    if (filters.sort) params = params.set('sort', filters.sort);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());

    filters.location?.forEach((loc) => (params = params.append('location', loc)));
    filters.nirfRanking?.forEach((r) => (params = params.append('nirfRanking', r)));
    filters.specialization?.forEach((s) => (params = params.append('specialization', s)));

    return this.http.get<PaginatedResponse<College>>(this.baseUrl, { params });
  }

  getFeatured(limit = 3): Observable<College[]> {
    return this.http.get<College[]>(`${this.baseUrl}/featured`, {
      params: { limit: limit.toString() },
    });
  }

  getBySlug(slug: string): Observable<College> {
    return this.http.get<College>(`${this.baseUrl}/${slug}`);
  }

  getSimilar(slug: string, limit = 4): Observable<College[]> {
    return this.http.get<College[]>(`${this.baseUrl}/${slug}/similar`, {
      params: { limit: limit.toString() },
    });
  }

  compare(ids: string[]): Observable<College[]> {
    return this.http.get<College[]>(`${this.baseUrl}/compare`, {
      params: { ids: ids.join(',') },
    });
  }
}
