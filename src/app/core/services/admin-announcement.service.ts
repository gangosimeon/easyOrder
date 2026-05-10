import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminAnnouncement {
  id:          string;
  title:       string;
  content:     string;
  type:        'info' | 'warning' | 'success' | 'urgent';
  active:      boolean;
  targetShops: string[];
  expireAt:    string | null;
  createdAt:   string;
}

export interface AnnouncementsListData {
  data:       AdminAnnouncement[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface AnnouncementFormData {
  title:       string;
  content:     string;
  type:        'info' | 'warning' | 'success' | 'urgent';
  active:      boolean;
  targetShops: string[];
  expireAt:    string | null;
}

@Injectable({ providedIn: 'root' })
export class AdminAnnouncementService {
  private http            = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  list(page = 1, limit = 20): Observable<AnnouncementsListData> {
    const params = new HttpParams()
      .set('page',  String(page))
      .set('limit', String(limit));
    return this.http.get<AnnouncementsListData>(
      `${this.apiUrl}/admin/announcements`, { params }
    );
  }

  create(data: AnnouncementFormData): Observable<AdminAnnouncement> {
    return this.http.post<AdminAnnouncement>(
      `${this.apiUrl}/admin/announcements`, data
    );
  }

  update(id: string, data: Partial<AnnouncementFormData>): Observable<AdminAnnouncement> {
    return this.http.put<AdminAnnouncement>(
      `${this.apiUrl}/admin/announcements/${id}`, data
    );
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/admin/announcements/${id}`);
  }

  toggle(id: string): Observable<AdminAnnouncement> {
    return this.http.patch<AdminAnnouncement>(
      `${this.apiUrl}/admin/announcements/${id}/toggle`, {}
    );
  }

  getActiveForShop(): Observable<AdminAnnouncement[]> {
    return this.http.get<AdminAnnouncement[]>(`${this.apiUrl}/shop/announcements`);
  }
}
