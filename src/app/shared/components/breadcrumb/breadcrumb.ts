import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbItem } from '../../models';

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  readonly items = input.required<BreadcrumbItem[]>();
}
