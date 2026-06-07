import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Annonce } from '../../models/annonce.model';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';
import { environment } from '../../../environments/environment';

export interface CompanyInfo {
  id: string;
  name: string;
  slug: string;
  phone: string;
  description: string;
  address: string;
  logo: string;
  coverColor: string;
}

export interface PublicShopCategory {
  name:  string;
  color: string;
  icon:  string;
}

export interface PublicShopInfo {
  id:           string;
  name:         string;
  slug:         string;
  address:      string;
  logo:         string;
  coverColor:   string;
  productCount: number;
  status:       'active' | 'inactive';
  categories:   PublicShopCategory[];
}

export interface PublicCategory {
  name:  string;
  color: string;
  icon:  string;
  count: number;
}

export interface ShopData {
  company:       CompanyInfo;
  categories:    Category[];
  products:      Product[];
  announcements: Annonce[];
}

export interface ShopsListParams {
  search?:   string;
  category?: string;
  limit?:    number;
}

@Injectable({ providedIn: 'root' })
export class PublicShopService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getShop(slug: string): Observable<ShopData> {
    return this.http.get<ShopData>(`${this.apiUrl}/public/shop/${slug}`);
  }

  getShopsList(params: ShopsListParams = {}): Observable<PublicShopInfo[]> {
    let p = new HttpParams();
    if (params.search)   p = p.set('search',   params.search);
    if (params.category) p = p.set('category', params.category);
    if (params.limit)    p = p.set('limit',    String(params.limit));
    return this.http.get<PublicShopInfo[]>(`${this.apiUrl}/public/shops`, { params: p });
  }

  getPublicCategories(): Observable<PublicCategory[]> {
    return this.http.get<PublicCategory[]>(`${this.apiUrl}/public/categories`);
  }
}
