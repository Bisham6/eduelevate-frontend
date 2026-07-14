import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  ogType?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  private readonly siteName = 'EduElevate';
  private readonly defaultDescription =
    'Discover colleges, track entrance exams, and plan your academic future with EduElevate.';

  update(config: Partial<SeoConfig>): void {
    const pageTitle = config.title
      ? `${config.title} | ${this.siteName}`
      : `${this.siteName} — Find Your Perfect Academic Future`;

    const description = config.description || this.defaultDescription;

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });

    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: config.ogType || 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }
}
