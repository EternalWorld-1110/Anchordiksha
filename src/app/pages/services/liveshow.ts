import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-liveshow-service',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  template: `
    <div class="min-h-screen bg-black text-white pt-24">
      <!-- Back Button -->
      <div class="max-w-7xl mx-auto px-8 py-8">
        <a routerLink="/" class="inline-flex items-center gap-2 text-gold/60 hover:text-gold transition-colors text-xs uppercase tracking-widest font-bold">
          <mat-icon class="scale-75">arrow_back</mat-icon> Back to Portfolio
        </a>
      </div>

      <div class="max-w-7xl mx-auto px-8 pb-32">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <!-- Image Section -->
          <div class="relative group order-2 lg:order-1">
            <div class="absolute -inset-4 bg-gold/20 rounded-3xl blur-2xl group-hover:bg-gold/30 transition-all duration-700"></div>
            <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop" 
                 alt="High Energy Live Shows" 
                 class="relative rounded-3xl w-full h-[600px] object-cover border border-white/10 shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
            <div class="absolute bottom-8 right-8 glass-morphism p-6 rounded-2xl border border-gold/30 max-w-xs animate-bounce">
              <div class="text-gold text-[10px] uppercase tracking-widest mb-2 font-black">Stage Vibe</div>
              <p class="text-white font-serif text-xl italic">“Feel the Energy. Live the Moment.”</p>
            </div>
          </div>

          <!-- Content Section -->
          <div class="space-y-10 order-1 lg:order-2">
            <div class="text-left">
              <div class="text-gold text-xs uppercase tracking-[0.4em] mb-4 font-black">The Stage Conductor</div>
              <h1 class="text-5xl md:text-7xl font-serif font-bold luxury-text-gradient leading-tight mb-8">
                Live Show <br> & Concert Emcee
              </h1>
              <p class="text-gray-400 text-lg leading-relaxed mb-6">
                When the event demands raw energy, Diksha takes the stage as the premier **Live Show Host in Delhi**. From massive college fests to international concerts, she controls the crowd with unmatched enthusiasm and a cinematic vibe that goes viral.
              </p>
              <p class="text-gray-400 text-lg leading-relaxed">
                Her spontaneous interaction, humor, and crowd engagement skills turn any event into an unforgettable experience.
              </p>
            </div>

            <div class="space-y-4">
              <h3 class="text-gold text-xs uppercase tracking-widest font-black mb-6 border-b border-gold/20 pb-2 inline-block">Her Key Qualities</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                @for (quality of showQualities; track quality) {
                  <div class="flex items-center gap-3 p-4 bg-gold/5 rounded-xl border border-gold/10 hover:border-gold/50 transition-all group">
                    <mat-icon class="text-gold scale-75 group-hover:rotate-12 transition-transform">bolt</mat-icon>
                    <span class="text-sm font-medium text-gray-300">{{ quality }}</span>
                  </div>
                }
              </div>
            </div>

            <div class="pt-8 flex flex-col sm:flex-row gap-6">
              <a routerLink="/" fragment="booking" class="bg-gold text-black px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl text-center">
                Book the Stage
              </a>
              <div class="flex items-center gap-4 text-gray-500 italic font-serif">
                <span class="h-px w-8 bg-gray-700"></span>
                Where the Crowd Comes Alive
              </div>
            </div>
          </div>
        </div>

        <!-- Explore More Section -->
        <div class="mt-40 border-t border-white/5 pt-20 pb-20">
          <h2 class="text-3xl font-serif font-bold luxury-text-gradient mb-12 text-center">Explore Other Offerings</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <a routerLink="/services/wedding" class="glass-morphism p-8 hover:border-gold/30 transition-all flex justify-between items-center group">
              <div>
                <div class="text-[10px] uppercase tracking-widest text-gold mb-2 font-bold">Royal Weddings</div>
                <div class="text-2xl font-serif font-bold">Luxury Stage Presence</div>
              </div>
              <mat-icon class="group-hover:translate-x-2 transition-transform">arrow_forward</mat-icon>
            </a>
            <a routerLink="/services/corporate" class="glass-morphism p-8 hover:border-gold/30 transition-all flex justify-between items-center group">
              <div>
                <div class="text-[10px] uppercase tracking-widest text-gold mb-2 font-bold">Elite Corporate</div>
                <div class="text-2xl font-serif font-bold">Strategic Communication</div>
              </div>
              <mat-icon class="group-hover:translate-x-2 transition-transform">arrow_forward</mat-icon>
            </a>
          </div>
        </div>

        <footer class="py-20 text-center border-t border-white/5">
          <div class="text-[10px] uppercase tracking-[0.4em] text-gray-600 font-medium">
            2026 A Luxury Digital Experience by Eternal Aura ARR
          </div>
        </footer>
      </div>
    </div>
  `
})
export class LiveShowService {
  showQualities = [
    'High energy and dynamic stage presence',
    'Strong crowd engagement and interaction',
    'Quick improvisation and humor',
    'Command over large audiences',
    'Seamless coordination with performers',
    'Keeps momentum alive throughout the event'
  ];
}
