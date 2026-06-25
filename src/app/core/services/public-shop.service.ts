import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Annonce } from '../../models/annonce.model';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';
import { environment } from '../../../environments/environment';

export interface CompanyInfo {
  id:          string;
  name:        string;
  slug:        string;
  phone:       string;
  fullPhone?:  string;
  description: string;
  address:     string;
  logo:        string;
  coverColor:  string;
}

export interface PublicShopCategory {
  name:  string;
  color: string;
  icon:  string;
}

export interface PreviewProduct {
  id:    string;
  image: string;
  name:  string;
}

export interface PublicShopInfo {
  id:              string;
  name:            string;
  slug:            string;
  address:         string;
  logo:            string;
  coverColor:      string;
  productCount:    number;
  status:          'active' | 'inactive';
  categories:      PublicShopCategory[];
  previewProducts: PreviewProduct[];
}

export interface PublicCategory {
  name:  string;
  color: string;
  icon:  string;
  count: number;
}

/** Réponse paginée de GET /public/shops */
export interface ShopsListResponse {
  shops:      PublicShopInfo[];
  page:       number;
  limit:      number;
  totalPages: number;
  totalItems: number;
  hasMore:    boolean;
}

export interface ShopData {
  company:        CompanyInfo;
  categories:     Category[];
  products:       Product[];
  announcements:  Annonce[];
  productPage:    number;
  productLimit:   number;
  productTotal:   number;
  productHasMore: boolean;
}

export interface ShopsListParams {
  search?:   string;
  category?: string;
  limit?:    number;
  page?:     number;
}

@Injectable({ providedIn: 'root' })
export class PublicShopService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getShop(slug: string, productPage = 1, productLimit = 20): Observable<ShopData> {
    let p = new HttpParams();
    if (productPage  > 1)    p = p.set('productPage',  String(productPage));
    if (productLimit !== 20) p = p.set('productLimit', String(productLimit));
    return this.http.get<ShopData>(`${this.apiUrl}/public/shop/${slug}`, { params: p });
  }

  getShopsList(params: ShopsListParams = {}): Observable<ShopsListResponse> {
    let p = new HttpParams();
    if (params.search)                 p = p.set('search',    params.search);
    if (params.category)               p = p.set('category',  params.category);
    if (params.limit)                  p = p.set('limit',     String(params.limit));
    if (params.page && params.page > 1) p = p.set('page',     String(params.page));
    return this.http.get<ShopsListResponse>(`${this.apiUrl}/public/shops`, { params: p });
  }

  getPublicCategories(): Observable<PublicCategory[]> {
    return this.http.get<PublicCategory[]>(`${this.apiUrl}/public/categories`);
  }

  invalidateCategoriesCache(): void {}
}
