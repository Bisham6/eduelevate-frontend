import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-card',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './category-card.html',
  styleUrl: './category-card.scss',
})
export class CategoryCard {
  readonly category = input.required<Category>();
}
