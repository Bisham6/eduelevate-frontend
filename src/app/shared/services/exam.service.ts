import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Exam, ExamFilters, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/exams`;

  getExams(filters: ExamFilters = {}): Observable<PaginatedResponse<Exam>> {
    let params = new HttpParams();

    if (filters.search) params = params.set('search', filters.search);
    if (filters.sort) params = params.set('sort', filters.sort);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());

    filters.category?.forEach((c) => (params = params.append('category', c)));
    filters.difficulty?.forEach((d) => (params = params.append('difficulty', d)));
    filters.examMode?.forEach((m) => (params = params.append('examMode', m)));

    return this.http.get<PaginatedResponse<Exam>>(this.baseUrl, { params });
  }

  getUpcoming(limit = 4): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.baseUrl}/upcoming`, {
      params: { limit: limit.toString() },
    });
  }
}
