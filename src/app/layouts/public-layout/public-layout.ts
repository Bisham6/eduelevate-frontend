import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavBar } from '../../shared/components/top-nav-bar/top-nav-bar';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, TopNavBar, Footer],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {}
