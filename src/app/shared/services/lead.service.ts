import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateLeadPayload } from '../models/lead.model';

export interface SubmitLeadResponse {
  message: string;
  id: string;
}

@Injectable({ providedIn: 'root' })
export class LeadService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/leads`;

  submitLead(payload: CreateLeadPayload): Observable<SubmitLeadResponse> {
    return this.http.post<SubmitLeadResponse>(this.baseUrl, payload);
  }
}
