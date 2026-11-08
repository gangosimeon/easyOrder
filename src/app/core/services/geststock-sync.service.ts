import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../../models/product.model';

export interface GeststockCategory {
  id: string;
  name: string;
}

export interface UnmatchedCategories {
  geststockCategories: GeststockCategory[];
  localCategories: GeststockCategory[];
}

/**
 * Appels HTTP liés à la synchronisation GestStock/JCMB (lot 3, JA2) :
 * rapprochement des catégories et validation des prix proposés.
 */
@Injectable({ providedIn: 'root' })
export class GeststockSyncService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/integrations/geststock`;
  private readonly productsBase = `${environment.apiUrl}/products`;

  /** Catégories non encore rapprochées des deux côtés. */
  getUnmatched(): Observable<UnmatchedCategories> {
    return this.http.get<UnmatchedCategories>(`${this.base}/unmatched`);
  }

  /** Fusionne une catégorie locale dans une catégorie GestStock. */
  matchCategory(geststockCategoryId: string, localCategoryId: string): Observable<void> {
    return this.http.post<void>(`${this.base}/match-category`, { geststockCategoryId, localCategoryId });
  }

  /** Produits dont le prix GestStock diffère du prix de vente en boutique. */
  getPriceSuggestions(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productsBase}/price-suggestions`);
  }

  /** Applique le prix de référence GestStock comme prix de vente. */
  acceptExternalPrice(productId: string): Observable<Product> {
    return this.http.post<Product>(`${this.productsBase}/${productId}/accept-external-price`, {});
  }
}
