import { createClient } from '@supabase/supabase-js';

// Access constants defined during build
const supabaseUrl = typeof VITE_SUPABASE_URL !== 'undefined' ? VITE_SUPABASE_URL : null;
const supabaseAnonKey = typeof VITE_SUPABASE_ANON_KEY !== 'undefined' ? VITE_SUPABASE_ANON_KEY : null;

// Only initialize if keys are present and not placeholders
const isValid = (val: string | null) => val && val !== 'YOUR_SUPABASE_URL' && val !== 'YOUR_SUPABASE_ANON_KEY';

if (typeof window !== 'undefined') {
  console.log('Supabase Connection Attempt:', {
    hasUrl: !!supabaseUrl,
    isValidUrl: isValid(supabaseUrl),
    hasKey: !!supabaseAnonKey,
    isValidKey: isValid(supabaseAnonKey)
  });
}

export const supabase = (isValid(supabaseUrl) && isValid(supabaseAnonKey)) 
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: false, // Avoid localStorage access during SSR
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    })
  : null as unknown as ReturnType<typeof createClient>;

if (!supabase) {
  console.warn('Supabase URL or Anon Key is missing. Database features will be disabled.');
}

export interface Booking {
  id?: string;
  name: string;
  phone: string;
  event_type: string;
  event_date: string;
  status: 'booked' | 'completed';
  message?: string;
  created_at?: string;
}

export interface GalleryImage {
  id?: string;
  url: string;
  title: string;
  display_order?: number;
  created_at?: string;
}

export interface AdminAccount {
  id?: string;
  email: string;
  password?: string;
  name: string;
  created_at?: string;
}
