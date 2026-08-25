import { Routes } from '@angular/router';
import { GuestGuard } from './core/guards/guest.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/landing/landing.routes').then(m => m.LANDING_ROUTES),
    canActivate: [GuestGuard]
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/category-list/category-list.component')
      .then(m => m.CategoryListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/product-list/product-list.component')
      .then(m => m.ProductListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'products/:categoryId',
    loadComponent: () => import('./features/products/product-list/product-list.component')
      .then(m => m.ProductListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'annonces',
    loadComponent: () => import('./features/announcements/annonce-list/annonce-list.component')
      .then(m => m.AnnonceListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [GuestGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [GuestGuard],
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () => import('./features/auth/pages/forgot-password/forgot-password.component')
      .then(m => m.ForgotPasswordComponent),
  },
  {
    path: 'auth/verify-otp',
    loadComponent: () => import('./features/auth/pages/verify-otp/verify-otp.component')
      .then(m => m.VerifyOtpComponent),
  },
  {
    path: 'auth/reset-password',
    loadComponent: () => import('./features/auth/pages/reset-password/reset-password.component')
      .then(m => m.ResetPasswordComponent),
  },
  {
    path: 'auth/success',
    loadComponent: () => import('./features/auth/pages/success/success.component')
      .then(m => m.SuccessComponent),
  },
  {
    path: 'change-password',
    loadComponent: () => import('./features/auth/change-password/change-password.component')
      .then(m => m.ChangePasswordComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'shops',
    loadComponent: () => import('./features/shop/discover-shops/discover-shops.component')
      .then(m => m.DiscoverShopsComponent),
  },
  {
    path: 'shop/:slug',
    loadComponent: () => import('./features/shop/public-shop/public-shop.component')
      .then(m => m.PublicShopComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/shop/cart/cart.component')
      .then(m => m.CartComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component')
      .then(m => m.ProfileComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/admin/shop-orders/shop-orders.component')
      .then(m => m.ShopOrdersComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [AuthGuard, AdminGuard],
  },
];
