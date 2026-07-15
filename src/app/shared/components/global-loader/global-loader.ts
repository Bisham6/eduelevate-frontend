import { Component, inject } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-global-loader',
  templateUrl: './global-loader.html',
  styleUrl: './global-loader.scss',
})
export class GlobalLoader {
  protected readonly loader = inject(LoaderService);
}
