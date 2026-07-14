import { Component, input, output, signal } from '@angular/core';
import { ImageType } from '../../../core/admin/media-upload.service';

@Component({
  selector: 'app-media-upload',
  imports: [],
  templateUrl: './media-upload.html',
  styleUrl: './media-upload.scss',
})
export class MediaUpload {
  readonly label = input.required<string>();
  readonly imageType = input.required<ImageType>();
  readonly currentUrl = input<string>('');
  readonly hint = input('JPG, PNG, WebP — max 5MB');

  readonly fileSelected = output<File>();

  protected readonly preview = signal<string>('');

  protected onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.preview.set(URL.createObjectURL(file));
    this.fileSelected.emit(file);
  }

  protected displayUrl(): string {
    return this.preview() || this.currentUrl();
  }
}
