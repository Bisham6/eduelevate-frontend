import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Course, CourseFilters, CoursePaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/courses`;

  getCourses(filters: CourseFilters = {}): Observable<CoursePaginatedResponse> {
    let params = new HttpParams();

    if (filters.search) params = params.set('search', filters.search);
    if (filters.budgetRange) params = params.set('budgetRange', filters.budgetRange);
    if (filters.sort) params = params.set('sort', filters.sort);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());

    filters.category?.forEach((c) => (params = params.append('category', c)));
    filters.location?.forEach((l) => (params = params.append('location', l)));
    filters.ranking?.forEach((r) => (params = params.append('ranking', r)));
    filters.mode?.forEach((m) => (params = params.append('mode', m)));

    return this.http.get<CoursePaginatedResponse>(this.baseUrl, { params });
  }

  getBySlug(slug: string): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/${slug}`);
  }

  getSimilar(slug: string, limit = 4): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/${slug}/similar`, {
      params: { limit: limit.toString() },
    });
  }
}
