import { Component, signal, computed, OnInit, PLATFORM_ID, inject, HostListener, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ThreeHero } from '../../components/three-hero/three-hero';
import { MatIconModule } from '@angular/material/icon';
import { animate, stagger, inView } from 'motion';
import { supabase, Booking, GalleryImage } from '../../supabase';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ThreeHero, MatIconModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  host: {
    '(mousemove)': 'onMouseMove($event)'
  }
})
export class Home implements OnInit, AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private el = inject(ElementRef);

  // Signals for state
  dbStatus = signal<'connecting' | 'connected' | 'error' | 'disconnected'>('connecting');
  selectedDate = signal<Date | null>(null);
  bookings = signal<Booking[]>([]);
  isBookingModalOpen = signal(false);
  isSuccessModalOpen = signal(false);
  isLightboxOpen = signal(false);
  isSubmitting = signal(false);
  activeImage = signal<string | null>(null);
  isHabitModalOpen = signal(false);
  currentCarouselIndex = signal(0);
  cursorPos = signal({ x: 0, y: 0 });
  timelineVisible = signal(false);
  blueprintVisible = signal(false);
  servicesVisible = signal(false);

  private fb = inject(FormBuilder);
  bookingForm: FormGroup;

  constructor() {
    this.bookingForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      event_type: ['Wedding', Validators.required],
      message: ['']
    });
  }

  // Carousel images
  carouselImages = [
    { 
      url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1920&auto=format&fit=crop', 
      title: 'The Elite Spotlight', 
      subtitle: 'Captivating elite audiences with timeless elegance and cultural resonance.' 
    },
    { 
      url: 'https://images.unsplash.com/photo-1514525253361-b83f859b73c0?q=80&w=1920&auto=format&fit=crop', 
      title: 'Grand Canvas Orchestration', 
      subtitle: 'Designing the atmosphere of luxury through voice and presence.' 
    },
    { 
      url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1920&auto=format&fit=crop', 
      title: 'The Cinematic Aura', 
      subtitle: 'Igniting the spirit of grand celebrations across the Indian capital.' 
    }
  ];

  currentMonth = signal(new Date());

  datesInMonth = computed(() => {
    const date = this.currentMonth();
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const dates = [];
    
    // Padding start of month
    const firstDay = start.getDay();
    for (let i = 0; i < firstDay; i++) {
      dates.push(null);
    }
    
    for (let i = 1; i <= end.getDate(); i++) {
      dates.push(new Date(date.getFullYear(), date.getMonth(), i, 0, 0, 0, 0));
    }
    return dates;
  });

  private formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  navItems = [
    { label: 'Origins', href: '#hero' },
    { label: 'Philosophy', href: '#about' },
    { label: 'Offerings', href: '#services' },
    { label: 'Portfolio', href: '#gallery' },
    { label: 'Timeline', href: '#events' },
    { label: 'Enquire', href: '#booking' }
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      const scrollProgress = document.getElementById('scroll-progress');
      if (scrollProgress) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
      }
    }
  }

  galleryImages = signal<GalleryImage[]>([
    { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop', title: 'Top Wedding Emcee Delhi NCR' },
    { url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200&auto=format&fit=crop', title: 'Professional Corporate Anchor India' },
    { url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=1200&auto=format&fit=crop', title: 'Luxury Event Host Mumbai' },
    { url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop', title: 'Live Show Presenter Bangalore' },
    { url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop', title: 'Destination Wedding Anchor India' },
    { url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200&auto=format&fit=crop', title: 'Gala Dinner Showcase Delhi' }
  ]);

  milestones = [
    { 
      metric: '12+', 
      label: 'Years of Magic', 
      desc: 'A decade of defining luxury standards across the globe with precision and grace.',
      icon: 'favorite',
      color: 'text-rose-500',
      num: '01'
    },
    { 
      metric: '1000+', 
      label: 'Corporate Milestones', 
      desc: 'Precision and professionalism for global brands and international summits.',
      icon: 'work',
      color: 'text-amber-500',
      num: '02'
    },
    { 
      metric: '500+', 
      label: 'Grand Live Spectacles', 
      desc: 'Unstoppable energy for massive crowds and televised spectacles.',
      icon: 'thunderstorm',
      color: 'text-sky-400',
      num: '03'
    }
  ];

  events = [
    { title: 'Grand Delhi Wedding', location: 'New Delhi', date: 'April 2026' },
    { title: 'Tech Innovation Summit', location: 'Gurugram', date: 'May 2026' },
    { title: 'Global Icon Awards 2026', location: 'Delhi NCR', date: 'June 2026' }
  ];

  ngOnInit() {
    this.fetchBookings();
    
    // Set current month to the start of the required period if it's before that
    const now = new Date();
    if (now.getFullYear() < 2026) {
      this.currentMonth.set(new Date(2026, 3, 1)); // April 2026
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.initLuxuryAnimations();
      
      // Auto-play carousel
      setInterval(() => {
        this.nextCarousel();
      }, 6000);

      const hasOnboarded = localStorage.getItem('onboarded');
      if (!hasOnboarded) {
        setTimeout(() => this.isHabitModalOpen.set(true), 2000);
      }
    }
  }

  private initLuxuryAnimations() {
    // Elegant reveal for Hero
    animate(
      '.luxury-reveal',
      { opacity: [0, 1], y: [40, 0] },
      { duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }
    );

    // Staggered reveal for Milestones
    inView('#milestones', (element) => {
      animate(
        element.querySelectorAll('.milestone-card'),
        { opacity: [0, 1], y: [30, 0] },
        { delay: stagger(0.15), duration: 0.8, ease: 'easeOut' }
      );
    });

    // Elegant reveal for Gallery Items
    inView('#gallery-grid', (element) => {
      animate(
        element.querySelectorAll('.gallery-item'),
        { opacity: [0, 1], scale: [0.98, 1] },
        { delay: stagger(0.1), duration: 0.8 }
      );
    });

    // Set visibility signals for other sections
    inView('#services', () => {
      this.servicesVisible.set(true);
    });

    inView('#events', () => {
      this.timelineVisible.set(true);
    });
  }

  async fetchBookings() {
    if (!supabase) {
      this.dbStatus.set('disconnected');
      return;
    }
    
    this.dbStatus.set('connecting');
    
    // Fetch bookings
    const bookingsPromise = supabase
      .from('bookings')
      .select('event_date, status');
    
    // Fetch Gallery
    const galleryPromise = supabase
      .from('gallery_images')
      .select('*')
      .order('display_order', { ascending: true });

    const [bookingsRes, galleryRes] = await Promise.all([bookingsPromise, galleryPromise]);
    
    if (bookingsRes.error || galleryRes.error) {
      console.error('Supabase connection error:', bookingsRes.error || galleryRes.error);
      this.dbStatus.set('connected'); // Technically connected but maybe table missing
    } else {
      this.dbStatus.set('connected');
      if (bookingsRes.data) this.bookings.set(bookingsRes.data as Booking[]);
      // Even if empty, we should sync with database to clear hardcoded ones
      if (galleryRes.data) {
        this.galleryImages.set(galleryRes.data as GalleryImage[]);
      }
    }
  }

  onMouseMove(e: MouseEvent) {
    if (this.isBrowser) {
      this.cursorPos.set({ x: e.clientX, y: e.clientY });
    }
  }

  setupIntersectionObserver() {
    if (!this.isBrowser) return;

    const observerOptions = { threshold: 0.1 };

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.timelineVisible.set(true);
          timelineObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const blueprintObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.blueprintVisible.set(true);
          blueprintObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const servicesObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.servicesVisible.set(true);
          servicesObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const timeline = document.querySelector('#events');
    const blueprint = document.querySelector('#milestones');
    const services = document.querySelector('#services');

    if (timeline) timelineObserver.observe(timeline);
    if (blueprint) blueprintObserver.observe(blueprint);
    if (services) servicesObserver.observe(services);
  }

  animateHero() {
    if (!this.isBrowser) return;
    animate(
      '.hero-content > *',
      { opacity: [0, 1], y: [20, 0] },
      { delay: stagger(0.2), duration: 1, ease: 'easeOut' }
    );
  }

  prevMonth() {
    const d = this.currentMonth();
    const newMonth = new Date(d.getFullYear(), d.getMonth() - 1, 1);
    
    // Prevent going back before April 2026 as per user request
    if (newMonth < new Date(2026, 3, 1)) return;
    this.currentMonth.set(newMonth);
  }

  nextMonth() {
    const d = this.currentMonth();
    const newMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    
    // Limit to 2027 as requested
    if (newMonth > new Date(2027, 11, 1)) return;
    this.currentMonth.set(newMonth);
  }

  getDateStatus(date: Date | null) {
    if (!date) return '';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // The incoming date is already UTC-ish from datesInMonth computed
    // but let's ensure we compare correctly
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate < today) return 'disabled';

    const dateStr = this.formatDate(date);
    const booking = this.bookings().find(b => b.event_date === dateStr);
    if (booking) return booking.status;
    return 'available';
  }

  onDateClick(date: Date | null) {
    if (!date) return;
    const status = this.getDateStatus(date);
    if (status === 'available') {
      this.selectedDate.set(date);
      this.isBookingModalOpen.set(true);
    }
  }

  async submitBooking() {
    console.log('Submit Booking initiated. Form valid:', this.bookingForm.valid);
    
    if (!supabase) {
      console.error('Supabase instance is null');
      alert('Database connection not configured. Please check your environment variables.');
      return;
    }

    if (this.bookingForm.invalid) {
      console.warn('Form validation failed:', this.bookingForm.errors);
      // Log individual field errors
      Object.keys(this.bookingForm.controls).forEach(key => {
        const controlErrors = this.bookingForm.get(key)?.errors;
        if (controlErrors) {
          console.log(`Field ${key} has errors:`, controlErrors);
        }
      });
      alert('Please fill all required fields correctly. Check the form for red highlights.');
      this.bookingForm.markAllAsTouched();
      return;
    }

    const date = this.selectedDate();
    if (!date) {
      console.warn('No date selected');
      return;
    }
    const dateStr = this.formatDate(date);

    this.isSubmitting.set(true);

    try {
      const formValue = this.bookingForm.value;
      const newBooking: any = {
        name: formValue.name,
        phone: formValue.phone,
        event_type: formValue.event_type,
        message: formValue.message || '',
        event_date: dateStr,
        status: 'booked'
      };

      console.log('Sending payload to Supabase:', newBooking);

      const { error } = await supabase
        .from('bookings')
        .insert([newBooking]);

      if (!error) {
        console.log('Booking successful:', newBooking);
        this.isBookingModalOpen.set(false);
        this.bookingForm.reset({ event_type: this.bookingForm.value.event_type });
        this.isSuccessModalOpen.set(true);
        this.fetchBookings();
        setTimeout(() => this.isSuccessModalOpen.set(false), 4000);
      } else {
        console.error('Supabase booking error:', error);
        alert(`Booking Error: ${error.message}\n\nHint: Ensure you have run the provided SQL in Supabase.`);
      }
    } catch (err: any) {
      console.error('Unexpected submission error:', err);
      alert('An unexpected error occurred. Please try again later.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  openLightbox(url: string) {
    this.activeImage.set(url);
    this.isLightboxOpen.set(true);
  }

  nextCarousel() {
    this.currentCarouselIndex.update(i => (i + 1) % this.carouselImages.length);
  }

  prevCarousel() {
    this.currentCarouselIndex.update(i => (i - 1 + this.carouselImages.length) % this.carouselImages.length);
  }

  setCarousel(index: number) {
    this.currentCarouselIndex.set(index);
  }

  closeOnboarding() {
    if (this.isBrowser) {
      localStorage.setItem('onboarded', 'true');
    }
    this.isHabitModalOpen.set(false);
  }
}

