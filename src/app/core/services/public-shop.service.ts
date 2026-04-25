import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Annonce } from '../../models/annonce.model';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';
import { environment } from '../../../environments/environment';

export interface CompanyInfo {
  name: string;
  slug: string;
  phone: string;
  description: string;
  address: string;
  logo: string;
  coverColor: string;
}

export interface ShopData {
  company: CompanyInfo;
  categories: Category[];
  products: Product[];
  announcements: Annonce[];
}

@Injectable({ providedIn: 'root' })
export class PublicShopService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getShop(slug: string): Observable<ShopData> {
    return this.http.get<ShopData>(`${this.apiUrl}/public/shop/${slug}`);
  }
}
