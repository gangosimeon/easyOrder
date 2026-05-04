import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DayCount    { date: string;   count: number; }
export interface SourceCount { source: string; count: number; }

export interface ShopStats {
  totalVisits:     number;
  uniqueVisitors:  number;
  visitsToday:     number;
  visitsThisMonth: number;
  visitsPerDay:    DayCount[];
  visitsBySource:  SourceCount[];
}

@Injectable({ providedIn: 'root' })
export class ShopStatsService {
  private http = inject(HttpClient);

  getStats(shopId: string): Observable<ShopStats> {
    return this.http.get<ShopStats>(`${environment.apiUrl}/shops/${shopId}/stats`);
  }
}
