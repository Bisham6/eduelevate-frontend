import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lead, LeadStatus, UpdateLeadPayload } from '../../shared/models/lead.model';

@Injectable({ providedIn: 'root' })
export class AdminLeadService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/admin/leads`;

  getAll(status?: LeadStatus): Observable<Lead[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Lead[]>(this.baseUrl, { params });
  }

  getById(id: string): Observable<Lead> {
    return this.http.get<Lead>(`${this.baseUrl}/${id}`);
  }

  update(id: string, payload: UpdateLeadPayload): Observable<Lead> {
    return this.http.patch<Lead>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
