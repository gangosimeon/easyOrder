import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/category-list/category-list.component')
      .then(m => m.CategoryListComponent),
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/product-list/product-list.component')
      .then(m => m.ProductListComponent),
  },
  {
    path: 'products/:categoryId',
    loadComponent: () => import('./features/products/product-list/product-list.component')
      .then(m => m.ProductListComponent),
  },
  {
    path: 'annonces',
    loadComponent: () => import('./features/announcements/annonce-list/annonce-list.component')
      .then(m => m.AnnonceListComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
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
  },
];
