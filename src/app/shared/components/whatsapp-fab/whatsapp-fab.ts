import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WHATSAPP_CHAT_URL } from '../../constants/whatsapp';

@Component({
  selector: 'app-whatsapp-fab',
  templateUrl: './whatsapp-fab.html',
  styleUrl: './whatsapp-fab.scss',
})
export class WhatsappFab {
  private readonly toastr = inject(ToastrService);

  protected onClick(): void {
    if (WHATSAPP_CHAT_URL) {
      window.open(WHATSAPP_CHAT_URL, '_blank', 'noopener,noreferrer');
      return;
    }
    this.toastr.info('WhatsApp chat coming soon');
  }
}
