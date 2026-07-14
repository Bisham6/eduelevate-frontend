import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { College, Exam } from '../../shared/models';

export interface GlobalSearchResult {
  colleges: College[];
  exams: Exam[];
  meta: {
    query: string;
    collegeCount: number;
    examCount: number;
  };
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/search`;

  search(query: string, limit = 8): Observable<GlobalSearchResult> {
    const params = new HttpParams().set('q', query).set('limit', limit.toString());
    return this.http.get<GlobalSearchResult>(this.baseUrl, { params });
  }
}
