import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LeadCaptureContext } from '../models/lead.model';
import { LeadCaptureDialog } from '../components/lead-capture-dialog/lead-capture-dialog';

@Injectable({ providedIn: 'root' })
export class LeadCaptureService {
  private readonly dialog = inject(MatDialog);

  open(context: LeadCaptureContext) {
    return this.dialog.open(LeadCaptureDialog, {
      data: context,
      width: '480px',
      maxWidth: '95vw',
      panelClass: 'lead-capture-dialog-panel',
      autoFocus: 'first-tabbable',
    });
  }
}
