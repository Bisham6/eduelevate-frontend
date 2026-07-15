import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SeoService } from './core/services/seo.service';
import { GlobalLoader } from './shared/components/global-loader/global-loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalLoader],
  template: `
    <app-global-loader />
    <router-outlet />
  `,
  styles: ':host { display: block; min-height: 100vh; }',
})
export class App implements OnInit {
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.updateSeoFromRoute());

    this.updateSeoFromRoute();
  }

  private updateSeoFromRoute(): void {
    let route: ActivatedRoute | null = this.router.routerState.root;
    while (route?.firstChild) route = route.firstChild;

    const data = route?.snapshot.data;
    const seo = data?.['seo'];

    if (seo) {
      this.seo.update(seo);
    } else if (route?.snapshot.title) {
      this.seo.update({
        title: String(route.snapshot.title).replace(' — CollegeChuniye', '').replace(' | CollegeChuniye', ''),
      });
    }
  }
}
