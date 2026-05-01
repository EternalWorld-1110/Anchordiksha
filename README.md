# Diksha Chaudhary - Premium Portfolio & Booking Platform

This is a premium, cinematic web application built for **Diksha Chaudhary** (Stage Anchor & Emcee). It features a dark luxury aesthetic, 3D visual elements, and a custom booking system.

## 🚀 Features
- **Cinematic Hero**: 3D abstract stage built with Three.js.
- **Custom Booking Calendar**: Interactive calendar to view availability and request bookings.
- **Admin Dashboard**: Protected route (`/admin`) to manage bookings, update status, and delete entries.
- **Supabase Integration**: Real-time database for storing and managing booking requests.
- **Premium Animations**: Smooth scroll and cinematic transitions powered by `motion`.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.

## 🛠 Tech Stack
- **Framework**: Angular 18+ (Zoneless)
- **Styling**: Tailwind CSS 4.0
- **3D Graphics**: Three.js
- **Animations**: Motion (Vanilla JS)
- **Database**: Supabase
- **Icons**: Angular Material Icons

## ⚙️ Setup & Deployment
1. **Supabase Setup**:
   - Create a new Supabase project.
   - Run the following SQL in your Supabase SQL Editor:
     ```sql
     create table bookings (
       id uuid default uuid_generate_v4() primary key,
       name text not null,
       phone text not null,
       event_type text not null,
       event_date date not null,
       status text default 'booked',
       message text,
       created_at timestamp with time zone default timezone('utc'::text, now()) not null
     );
     ```
2. **Environment Variables**:
   - Rename `.env.example` to `.env` (or set in deployment platform).
   - Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

3. **Images**:
   - Replace the placeholder images in `/public/images/anchor/` with the real photos provided.
   - Files to replace: `hero.jpg`, `gallery1.jpg`, `gallery2.jpg`.

4. **Admin Access**:
   - Route: `/admin`
   - Email: `diksha@anchor.com`
   - Password: `luxury2024`

## 🎨 Aesthetic
- **Primary Color**: Black (#050505)
- **Accent Color**: Gold (#D4AF37)
- **Typography**: Playfair Display (Serif) & Inter (Sans-Serif)
