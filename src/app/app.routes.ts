import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  {
    path: 'categories',
    loadComponent: () => import('./components/category-list/category-list.component')
      .then(m => m.CategoryListComponent),
  },
  {
    path: 'products',
    loadComponent: () => import('./components/product-list/product-list.component')
      .then(m => m.ProductListComponent),
  },
  {
    path: 'products/:categoryId',
    loadComponent: () => import('./components/product-list/product-list.component')
      .then(m => m.ProductListComponent),
  },
  {
    path: 'annonces',
    loadComponent: () => import('./components/annonce-list/annonce-list.component')
      .then(m => m.AnnonceListComponent),
  },
  {
    path: 'shop/:slug',
    loadComponent: () => import('./public-shop/public-shop.component')
      .then(m => m.PublicShopComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart.component')
      .then(m => m.CartComponent),
  },
];
