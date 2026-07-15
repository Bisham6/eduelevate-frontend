import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavBar } from '../../shared/components/top-nav-bar/top-nav-bar';
import { Footer } from '../../shared/components/footer/footer';
import { BottomNavBar } from '../../shared/components/bottom-nav-bar/bottom-nav-bar';
import { WhatsappFab } from '../../shared/components/whatsapp-fab/whatsapp-fab';
import { MobileSearchSheet } from '../../shared/components/mobile-search-sheet/mobile-search-sheet';
import { MobileFilterDrawer } from '../../shared/components/mobile-filter-drawer/mobile-filter-drawer';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, TopNavBar, Footer, BottomNavBar, WhatsappFab, MobileSearchSheet, MobileFilterDrawer],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {}
