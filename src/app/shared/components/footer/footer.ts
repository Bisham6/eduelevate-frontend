import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BRAND_LOGO_SRC } from '../../constants/brand';

interface FooterLinkGroup {
  title: string;
  links: { label: string; path: string }[];
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly brandLogoSrc = BRAND_LOGO_SRC;
  protected readonly currentYear = new Date().getFullYear();

  protected readonly linkGroups: FooterLinkGroup[] = [
    {
      title: 'Platform',
      links: [
        { label: 'Colleges', path: '/colleges' },
        { label: 'Courses', path: '/courses' },
        { label: 'Exams', path: '/exams' },
        { label: 'Compare', path: '/compare' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Contact', path: '/contact' },
        { label: 'Careers', path: '/careers' },
        { label: 'Blog', path: '/blog' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', path: '/help' },
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Sitemap', path: '/sitemap' },
      ],
    },
  ];

  protected readonly socialLinks = [
    { icon: 'link', label: 'LinkedIn', url: 'https://linkedin.com' },
    { icon: 'tag', label: 'Twitter', url: 'https://twitter.com' },
    { icon: 'play_circle', label: 'YouTube', url: 'https://youtube.com' },
  ];
}
