import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-corporate-service',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  template: `
    <div class="min-h-screen bg-black text-white pt-24">
      <!-- Back Button -->
      <div class="max-w-7xl mx-auto px-8 py-8">
        <a routerLink="/" class="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold">
          <mat-icon class="scale-75">arrow_back</mat-icon> Back to Portfolio
        </a>
      </div>

      <div class="max-w-7xl mx-auto px-8 pb-32">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <!-- Image Section -->
          <div class="relative group order-2 lg:order-1">
            <div class="absolute -inset-4 bg-white/5 rounded-3xl blur-2xl group-hover:bg-white/10 transition-all duration-700"></div>
            <img src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop" 
                 alt="Corporate Excellence Anchor" 
                 class="relative rounded-3xl w-full h-[600px] object-cover border border-white/10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000">
            <div class="absolute bottom-8 right-8 glass-morphism p-6 rounded-2xl border border-white/30 max-w-xs">
              <div class="text-white text-[10px] uppercase tracking-widest mb-2 font-black opacity-50">Core Philosophy</div>
              <p class="text-white font-serif text-xl italic uppercase tracking-tighter">“Precision. Presence. Performance.”</p>
            </div>
          </div>

          <!-- Content Section -->
          <div class="space-y-10 order-1 lg:order-2">
            <div class="text-left">
              <div class="text-gray-500 text-xs uppercase tracking-[0.4em] mb-4 font-black">Strategic Communication</div>
              <h1 class="text-5xl md:text-7xl font-serif font-bold luxury-text-gradient leading-tight mb-8">
                Corporate Show <br> Host India
              </h1>
              <p class="text-gray-400 text-lg leading-relaxed mb-6">
                As a premier **Corporate Anchor in India**, Diksha delivers polished, confident, and articulate presentation tailored for elite professional environments. Whether it’s multi-city product launches in Mumbai or award nights in Delhi, she ensures your brand resonates with authority.
              </p>
              <p class="text-gray-400 text-lg leading-relaxed">
                She knows how to balance professionalism with energy — keeping audiences attentive without overdoing it. Her communication is clear, impactful, and aligned with brand tone.
              </p>
            </div>

            <div class="space-y-4">
              <h3 class="text-white text-xs uppercase tracking-widest font-black mb-6 border-b border-white/20 pb-2 inline-block">Professional Qualities</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                @for (quality of corporateQualities; track quality) {
                  <div class="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/30 transition-all">
                    <mat-icon class="text-gray-400 scale-75">verified</mat-icon>
                    <span class="text-sm font-medium text-gray-300">{{ quality }}</span>
                  </div>
                }
              </div>
            </div>

            <div class="pt-8 flex flex-col sm:flex-row gap-6">
              <a routerLink="/" fragment="booking" class="bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-gold transition-all shadow-2xl text-center">
                Inquire for Events
              </a>
              <div class="flex items-center gap-4 text-gray-500 italic font-serif">
                <span class="h-px w-8 bg-gray-700"></span>
                Where Professionalism Meets Impact
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
            <a routerLink="/services/liveshow" class="glass-morphism p-8 hover:border-gold/30 transition-all flex justify-between items-center group">
              <div>
                <div class="text-[10px] uppercase tracking-widest text-gold mb-2 font-bold">High Energy</div>
                <div class="text-2xl font-serif font-bold">Live Stage Spectacles</div>
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
export class CorporateService {
  corporateQualities = [
    'Professional and polished communication',
    'Clear diction and stage control',
    'Experience with corporate executives',
    'Time management and agenda handling',
    'Brand-aligned tone and presentation style',
    'Quick adaptability during live situations'
  ];
}
