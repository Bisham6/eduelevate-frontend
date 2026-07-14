export type LeadSource = 'apply_now' | 'inquiry_form' | 'compare';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';

export interface Lead {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  collegeId?: string;
  collegeName?: string;
  source: LeadSource;
  status: LeadStatus;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadPayload {
  fullName: string;
  email: string;
  phone: string;
  collegeId?: string;
  collegeName?: string;
  source: LeadSource;
}

export interface UpdateLeadPayload {
  status?: LeadStatus;
  remarks?: string;
}

export interface LeadCaptureContext {
  collegeId?: string;
  collegeName?: string;
  source: LeadSource;
}

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  converted: 'Converted',
  closed: 'Closed',
};

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  apply_now: 'Apply Now',
  inquiry_form: 'Inquiry Form',
  compare: 'Compare',
};
