import { Component, signal, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { supabase, Booking, GalleryImage, AdminAccount } from '../../supabase';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  isLoggedIn = signal(false);
  isLoggingIn = signal(false);
  isUploading = signal(false);
  loginStatus = signal<{msg: string, type: 'error' | 'success'} | null>(null);
  activeTab = signal<'bookings' | 'gallery' | 'admins'>('bookings');
  
  // Use signals for form data
  loginEmail = signal('');
  loginPassword = signal('');
  
  bookings = signal<Booking[]>([]);
  gallery = signal<GalleryImage[]>([]);
  adminAccounts = signal<AdminAccount[]>([]);

  // New Image Form
  newImage = signal<GalleryImage>({
    url: '',
    title: '',
    display_order: 0
  });

  // New Admin Form
  newAdmin = signal<AdminAccount>({
    email: '',
    password: '',
    name: ''
  });

  private router = inject(Router);

  ngOnInit() {
    if (this.isBrowser && localStorage.getItem('admin_session') === 'true') {
      this.isLoggedIn.set(true);
      this.loadAllData();
    }
  }

  async login() {
    if (!supabase) {
      alert('Database connection not available. Please ensure your Supabase URL and Key are set in the environment.');
      return;
    }
    
    this.isLoggingIn.set(true);
    this.loginStatus.set(null);
    const email = this.loginEmail().trim();
    const password = this.loginPassword().trim();
    
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (data && !error) {
        console.log('Login successful');
        this.isLoggedIn.set(true);
        if (this.isBrowser) {
          localStorage.setItem('admin_session', 'true');
          localStorage.setItem('admin_email', data.email);
        }
        this.loadAllData();
      } else {
        console.warn('Login failed:', error);
        this.loginStatus.set({ 
          msg: 'Access Denied: Invalid credentials. Ensure you ran the SQL to create the "admins" table and add your account.', 
          type: 'error' 
        });
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      this.loginStatus.set({ 
        msg: 'Connection error. Please check if Supabase is correctly configured.', 
        type: 'error' 
      });
    } finally {
      this.isLoggingIn.set(false);
    }
  }

  logout() {
    this.isLoggedIn.set(false);
    if (this.isBrowser) {
      localStorage.removeItem('admin_session');
    }
  }

  async loadAllData() {
    if (!supabase) return;
    this.fetchBookings();
    this.fetchGallery();
    this.fetchAdmins();
  }

  async fetchBookings() {
    if (!supabase) {
      console.warn('Supabase not available for fetchBookings');
      return;
    }
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('event_date', { ascending: false });
    
    if (error) console.error('Error fetching bookings:', error);
    if (data) this.bookings.set(data);
  }

  async fetchGallery() {
    if (!supabase) {
      console.warn('Supabase not available for fetchGallery');
      return;
    }
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) console.error('Error fetching gallery:', error);
    if (data) this.gallery.set(data);
  }

  async updateStatus(booking: Booking, status: 'booked' | 'completed') {
    if (!supabase) return;
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', booking.id);
    
    if (!error) {
      this.fetchBookings();
    }
  }

  async deleteBooking(id: string) {
    if (!id) return;
    if (this.isBrowser && !confirm('Are you sure you want to delete this booking?')) return;
    if (!supabase) return;
    
    try {
      console.log('--- BOOKING DELETION ATTEMPT ---');
      console.log('Target ID:', id);
      const { error, status, statusText } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Delete Error:', error);
        alert(`Delete failed: ${error.message}\nStatus: ${status} ${statusText}`);
        return;
      }
      
      console.log('Delete status:', status, statusText);
      this.fetchBookings();
    } catch (err) {
      console.error('Unexpected error during booking deletion:', err);
      alert('An unexpected error occurred during booking deletion.');
    }
  }

  // Gallery Methods
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !supabase) return;

    this.isUploading.set(true);
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = `images/${fileName}`;

    try {
      const { error } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      this.newImage.update(img => ({ ...img, url: publicUrl }));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Upload error:', err);
      alert('Upload failed: ' + errorMessage);
    } finally {
      this.isUploading.set(false);
    }
  }

  async addImage() {
    if (!supabase) return;
    if (!this.newImage().url || !this.newImage().title) {
      alert('Please provide both URL and title');
      return;
    }

    const { error } = await supabase
      .from('gallery_images')
      .insert([this.newImage()]);

    if (!error) {
      this.newImage.set({ url: '', title: '', display_order: this.gallery().length });
      this.fetchGallery();
    } else {
      alert('Error adding image');
    }
  }

  async deleteImage(id: string) {
    if (!id) {
      console.error('Delete failed: No image ID provided');
      return;
    }
    
    if (this.isBrowser && !confirm('Are you sure you want to delete this image permanently?')) return;
    if (!supabase) return;

    try {
      console.log('--- IMAGE DELETION ATTEMPT ---');
      console.log('Target ID:', id);
      
      // Get image details first to delete from storage as well
      const { data: imgData, error: fetchError } = await supabase
        .from('gallery_images')
        .select('url')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.warn('Could not fetch image details before deletion:', fetchError);
      }

      const { error, status, statusText } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase deletion error:', error);
        alert(`Error deleting image record: ${error.message}\nStatus: ${status} ${statusText}`);
        return;
      }

      console.log('Delete status:', status, statusText);

      // Try to delete from storage if we have the URL
      if (imgData?.url) {
        try {
          const galleryPart = '/gallery/';
          const partIndex = imgData.url.indexOf(galleryPart);
          if (partIndex !== -1) {
            const filePath = imgData.url.substring(partIndex + galleryPart.length);
            const { error: storageError } = await supabase.storage.from('gallery').remove([filePath]);
            if (storageError) {
               console.warn('Storage removal returned error:', storageError);
            } else {
               console.log('Storage file deleted successfully:', filePath);
            }
          }
        } catch (storageErr) {
          console.warn('Storage cleanup exception:', storageErr);
        }
      }

      alert('Successfully deleted.');
      this.fetchGallery();
    } catch (err) {
      console.error('Unexpected error during deletion:', err);
      alert('An unexpected error occurred during deletion.');
    }
  }

  async updateImageOrder(image: GalleryImage, direction: 'up' | 'down') {
    if (!supabase) return;
    const index = this.gallery().findIndex(img => img.id === image.id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === this.gallery().length - 1) return;

    const swapWithIndex = direction === 'up' ? index - 1 : index + 1;
    const otherImage = this.gallery()[swapWithIndex];

    const { error } = await supabase.from('gallery_images').update({ display_order: otherImage.display_order }).eq('id', image.id);
    const { error: error2 } = await supabase.from('gallery_images').update({ display_order: image.display_order }).eq('id', otherImage.id);

    if (!error && !error2) {
      this.fetchGallery();
    }
  }

  // Admin Management Methods
  async fetchAdmins() {
    if (!supabase) return;
    const { data } = await supabase.from('admins').select('id, email, name, created_at');
    if (data) this.adminAccounts.set(data as AdminAccount[]);
  }

  async addAdmin() {
    if (!supabase) return;
    if (!this.newAdmin().email || !this.newAdmin().password || !this.newAdmin().name) {
      alert('Please fill all admin fields');
      return;
    }

    const { error } = await supabase.from('admins').insert([this.newAdmin()]);
    if (!error) {
      alert('Admin account created successfully');
      this.newAdmin.set({ email: '', password: '', name: '' });
      this.fetchAdmins();
    } else {
      console.error('Error creating admin:', error);
      alert('Error creating admin account: ' + error.message);
    }
  }

  async deleteAdmin(id: string) {
    if (!id) {
      alert('Delete failed: No ID provided');
      return;
    }
    if (this.isBrowser && !confirm('Are you sure you want to delete this admin account?')) return;
    if (!supabase) {
      alert('Database connection error');
      return;
    }

    try {
      console.log('--- ADMIN DELETION ATTEMPT ---');
      console.log('Target ID:', id);
      
      const { error, status, statusText } = await supabase
        .from('admins')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Database Error:', error);
        alert(`Delete failed: ${error.message}\nStatus: ${status} ${statusText}`);
        return;
      }
      
      console.log('Delete status:', status, statusText);
      alert('Admin account removed successfully.');
      this.fetchAdmins();
    } catch (err) {
      console.error('Unexpected exception:', err);
      alert('An unexpected error occurred during admin deletion. Check console for details.');
    }
  }
}

