import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lead, LeadStatus, UpdateLeadPayload } from '../../shared/models/lead.model';
import { AdminAuthStore } from '../admin/admin-auth.store';

@Injectable({ providedIn: 'root' })
export class AdminLeadService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AdminAuthStore);
  private readonly baseUrl = `${environment.apiUrl}/admin/leads`;

  private headers(): HttpHeaders {
    return new HttpHeaders({ 'x-admin-key': this.auth.getKey() });
  }

  getAll(status?: LeadStatus): Observable<Lead[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Lead[]>(this.baseUrl, { headers: this.headers(), params });
  }

  getById(id: string): Observable<Lead> {
    return this.http.get<Lead>(`${this.baseUrl}/${id}`, { headers: this.headers() });
  }

  update(id: string, payload: UpdateLeadPayload): Observable<Lead> {
    return this.http.patch<Lead>(`${this.baseUrl}/${id}`, payload, { headers: this.headers() });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.headers() });
  }
}
