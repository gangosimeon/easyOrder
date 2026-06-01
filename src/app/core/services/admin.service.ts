import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminShop {
  id:           string;
  name:         string;
  slug:         string;
  phone:        string;
  description:  string;
  logo:         string;
  address:      string;
  coverColor:   string;
  createdAt:    string;
  productCount: number;
  status:       'active' | 'inactive';
  isActive:     boolean;
  publicUrl:    string;
}

export interface AdminShopDetail extends AdminShop {
  categoryCount:  number;
  orderCount:     number;
  recentProducts: AdminShopProduct[];
}

export interface AdminShopProduct {
  id:        string;
  name:      string;
  price:     number;
  image:     string;
  inStock:   boolean;
  createdAt: string;
}

export interface AdminShopStats {
  shopId:           string;
  shopName:         string;
  shopSlug:         string;
  productCount:     number;
  categoryCount:    number;
  orderCount:       number;
  recentOrderCount: number;
  visits: {
    total:  number;
    unique: number;
    today:  number;
    perDay: Array<{ date: string; count: number }>;
  };
}

export interface AggregateShopStats {
  totalShops:    number;
  activeShops:   number;
  inactiveShops: number;
  totalProducts: number;
  monthlyGrowth: Array<{ month: string; count: number }>;
  topShops:      Array<{ id: string; name: string; slug: string; productCount: number }>;
}

export interface PaginationMeta {
  page:       number;
  limit:      number;
  total:      number;
  totalPages: number;
  hasNext:    boolean;
  hasPrev:    boolean;
}

export interface AdminShopsData {
  shops:      AdminShop[];
  pagination: PaginationMeta;
}

export interface PlatformStats {
  totalShops:        number;
  totalProducts:     number;
  totalOrders:       number;
  newShopsThisMonth: number;
}

export interface ShopsQueryParams {
  search?:    string;
  page?:      number;
  limit?:     number;
  sortField?: string;
  sortDir?:   'asc' | 'desc';
  status?:    'active' | 'inactive' | 'all';
  dateFrom?:  string;
  dateTo?:    string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http            = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getShops(params: ShopsQueryParams = {}): Observable<AdminShopsData> {
    let p = new HttpParams();
    if (params.search)       p = p.set('search',    params.search);
    if (params.page != null) p = p.set('page',      String(params.page + 1));
    if (params.limit)        p = p.set('limit',     String(params.limit));
    if (params.sortField)    p = p.set('sortField', params.sortField);
    if (params.sortDir)      p = p.set('sortDir',   params.sortDir);
    if (params.status)       p = p.set('status',    params.status);
    if (params.dateFrom)     p = p.set('dateFrom',  params.dateFrom);
    if (params.dateTo)       p = p.set('dateTo',    params.dateTo);
    return this.http.get<AdminShopsData>(`${this.apiUrl}/admin/shops`, { params: p });
  }

  getStats(): Observable<PlatformStats> {
    return this.http.get<PlatformStats>(`${this.apiUrl}/admin/stats`);
  }

  getShopById(id: string): Observable<AdminShopDetail> {
    return this.http.get<AdminShopDetail>(`${this.apiUrl}/admin/shops/${id}`);
  }

  getShopStats(id: string): Observable<AdminShopStats> {
    return this.http.get<AdminShopStats>(`${this.apiUrl}/admin/shops/${id}/stats`);
  }

  getAggregateShopStats(): Observable<AggregateShopStats> {
    return this.http.get<AggregateShopStats>(`${this.apiUrl}/admin/shops/stats`);
  }

  toggleShopVisibility(shopId: string, isActive: boolean): Observable<{ id: string; isActive: boolean }> {
    return this.http.patch<{ id: string; isActive: boolean }>(
      `${this.apiUrl}/admin/shops/${shopId}/toggle-visibility`,
      { isActive },
    );
  }
}
