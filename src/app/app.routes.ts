import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then(m => m.Admin)
  },
  {
    path: 'services/wedding',
    loadComponent: () => import('./pages/services/wedding').then(m => m.WeddingService)
  },
  {
    path: 'services/corporate',
    loadComponent: () => import('./pages/services/corporate').then(m => m.CorporateService)
  },
  {
    path: 'services/liveshow',
    loadComponent: () => import('./pages/services/liveshow').then(m => m.LiveShowService)
  },
  {
    path: 'bio',
    loadComponent: () => import('./pages/services/bio').then(m => m.Biography)
  }
];
