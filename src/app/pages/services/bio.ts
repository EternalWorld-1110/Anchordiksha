import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  template: `
    <div class="min-h-screen bg-black text-white selection:bg-gold selection:text-black">
      
      <!-- Hero Header -->
      <section class="pt-48 pb-20 px-8">
        <div class="max-w-5xl mx-auto text-center">
          <div class="text-gold text-xs uppercase tracking-[0.5em] mb-8 font-black">Professional Biography</div>
          <h1 class="text-6xl md:text-8xl font-serif font-bold mb-12 luxury-text-gradient leading-tight">A Legacy of <br> Voice & Vision</h1>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-start text-left mt-24">
            <div class="space-y-8">
              <p class="text-xl text-gray-300 leading-relaxed font-light">
                For over 12 years, Diksha Chaudhary has been the definitive voice of New Delhi's most prestigious events. Her journey began with a passion for storytelling and has evolved into a strategic mastery of stagecraft.
              </p>
              <p class="text-gray-400 leading-relaxed">
                With a background in mass communication and performing arts, she brings a unique blend of intellectual depth and artistic flair to every microphone she holds. Her ability to pivot between the high-octane energy of a stadium show and the sensitive emotional resonance of a wedding is what sets her apart as a master of ceremonies.
              </p>
              <div class="pt-8 border-t border-white/10">
                <blockquote class="text-2xl font-serif italic text-gold/80 mb-4">
                  "The stage is not just a platform; it's a conversation. My role is to ensure that conversation is unforgettable."
                </blockquote>
                <cite class="text-xs uppercase tracking-widest text-gray-500 font-bold block">— Diksha Chaudhary</cite>
              </div>
            </div>

            <div class="relative group">
              <div class="absolute -inset-4 bg-gold/10 rounded-3xl blur-2xl group-hover:bg-gold/20 transition-all"></div>
              <img src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1470&auto=format&fit=crop" alt="Diksha Chaudhary Portrait" class="relative rounded-3xl w-full h-[600px] object-cover border border-white/10 grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl">
              
              <div class="absolute -bottom-8 -left-8 glass-morphism p-8 rounded-2xl border border-gold/30">
                <div class="text-4xl font-bold luxury-text-gradient mb-1">4000+</div>
                <div class="text-[10px] uppercase tracking-widest text-gray-400 font-black">Successful Deliveries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Signature Style -->
      <section class="py-32 bg-[#050505]">
        <div class="max-w-7xl mx-auto px-8">
          <h2 class="text-4xl font-serif font-bold text-center mb-20 luxury-text-gradient">The Signature Methodology</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div class="p-10 border border-white/5 rounded-3xl hover:border-gold/30 transition-all">
              <mat-icon class="text-gold mb-6 scale-125">psychology</mat-icon>
              <h3 class="text-xl font-bold mb-4 tracking-tight">Psychological Priming</h3>
              <p class="text-gray-500 text-sm leading-relaxed">Mastering the audience's subconscious journey, ensuring maximum engagement through tone, pace, and strategic pauses.</p>
            </div>
            <div class="p-10 border border-white/5 rounded-3xl hover:border-gold/30 transition-all">
              <mat-icon class="text-gold mb-6 scale-125">auto_awesome</mat-icon>
              <h3 class="text-xl font-bold mb-4 tracking-tight">Stage Architecture</h3>
              <p class="text-gray-500 text-sm leading-relaxed">Utilizing the entire stage space to create a visual performance that complements the auditory experience.</p>
            </div>
            <div class="p-10 border border-white/5 rounded-3xl hover:border-gold/30 transition-all">
              <mat-icon class="text-gold mb-6 scale-125">diversity_1</mat-icon>
              <h3 class="text-xl font-bold mb-4 tracking-tight">Cultural Synthesis</h3>
              <p class="text-gray-500 text-sm leading-relaxed">Blending traditional values with modern aesthetics, making her the perfect choice for diverse global audiences.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-40 text-center px-8">
        <h2 class="text-5xl font-serif font-bold mb-8 luxury-text-gradient">Experience the Resonance</h2>
        <p class="text-gray-400 mb-12 max-w-xl mx-auto">Diksha's calendar is currently open for the 2026-2027 season. Coordinate your next landmark event with the elite voice of Delhi.</p>
        <a routerLink="/" fragment="booking" class="bg-gold text-black px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl">
          Reserve Engagement
        </a>
      </section>

      <footer class="py-20 text-center border-t border-white/5">
        <div class="text-[10px] uppercase tracking-[0.4em] text-gray-600 font-medium">
          2026 A Luxury Digital Experience by Eternal Aura ARR
        </div>
      </footer>
    </div>
  `
})
export class Biography {}
