import { Component, signal, inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <nav [class]="isScrolled() ? 'bg-black/80 backdrop-blur-xl border-white/5 py-3' : 'bg-transparent py-6'"
         class="fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-transparent">
      <div class="max-w-7xl mx-auto px-8 flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center gap-2 group cursor-pointer" routerLink="/">
          <div class="text-xl md:text-2xl font-serif font-black luxury-text-gradient tracking-tighter">DIKSHA CHAUDHARY</div>
        </div>
        
        <!-- Desktop Menu -->
        <div class="hidden md:flex gap-10">
          @for (item of navItems; track item.label) {
            <a [routerLink]="item.route" [fragment]="item.fragment" 
               class="text-[10px] uppercase tracking-[0.4em] text-white/70 hover:text-gold transition-colors duration-300 font-bold">
              {{ item.label }}
            </a>
          }
        </div>

        <!-- CTA -->
        <div class="flex items-center gap-6">
          <a routerLink="/" fragment="booking" class="bg-gold px-8 py-2.5 rounded-full text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-gold/20">
            Reserve
          </a>
          
          <!-- Mobile Menu Toggle -->
          <button (click)="isMobileMenuOpen.set(!isMobileMenuOpen())" class="md:hidden text-white">
            <mat-icon>{{ isMobileMenuOpen() ? 'close' : 'menu' }}</mat-icon>
          </button>
        </div>
      </div>

      <!-- Mobile Menu Overlay -->
      @if (isMobileMenuOpen()) {
        <div class="fixed inset-0 top-[64px] bg-black/95 backdrop-blur-2xl z-40 flex flex-col p-8 md:hidden h-[calc(100vh-64px)]">
          <div class="flex flex-col gap-8 mt-12">
            @for (item of navItems; track item.label) {
              <a [routerLink]="item.route" [fragment]="item.fragment" 
                 (click)="isMobileMenuOpen.set(false)"
                 class="text-2xl font-serif font-bold text-white hover:text-gold transition-all flex justify-between items-center luxury-text-gradient">
                {{ item.label }}
                <mat-icon class="scale-150">chevron_right</mat-icon>
              </a>
            }
          </div>
          
          <div class="mt-auto pb-12 border-t border-white/10 pt-12 flex flex-col gap-6">
            <a href="tel:+91XXXXXXXXXX" class="flex items-center gap-4 text-gray-400">
              <mat-icon>phone</mat-icon>
              <span class="text-sm font-bold tracking-widest uppercase">Direct Line</span>
            </a>
          </div>
        </div>
      }
    </nav>
  `
})
export class Navbar {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private router = inject(Router);

  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);

  navItems = [
    { label: 'Origins', route: '/', fragment: 'hero' },
    { label: 'Philosophy', route: '/', fragment: 'about' },
    { label: 'Offerings', route: '/', fragment: 'services' },
    { label: 'Portfolio', route: '/', fragment: 'gallery' },
    { label: 'Timeline', route: '/', fragment: 'events' }
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      this.isScrolled.set(window.scrollY > 50);
    }
  }

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isMobileMenuOpen.set(false);
    });
  }
}
