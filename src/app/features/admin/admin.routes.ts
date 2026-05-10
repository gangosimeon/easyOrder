import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'shops',
    pathMatch: 'full',
  },
  {
    path: 'shops',
    loadComponent: () =>
      import('./shops/admin-shops.component').then(m => m.AdminShopsComponent),
  },
  {
    path: 'announcements',
    loadComponent: () =>
      import('./announcements/admin-announcements.component').then(m => m.AdminAnnouncementsComponent),
  },
];
