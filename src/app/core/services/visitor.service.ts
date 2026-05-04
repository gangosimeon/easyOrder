import { Injectable } from '@angular/core';

const STORAGE_KEY = 'bk_visitor_id';

@Injectable({ providedIn: 'root' })
export class VisitorService {

  getVisitorId(): string {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;

    const id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
    return id;
  }
}
