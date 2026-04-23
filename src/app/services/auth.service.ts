import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface Company {
  id: string;
  name: string;
  slug: string;
  phone: string;
  description: string;
  logo: string;
  address: string;
  coverColor: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  password: string;
  description: string;
  logo: string;
  address: string;
  coverColor: string;
}

const MOCK_CREDENTIALS = { phone: '22677938688', password: 'password123' };

const MOCK_COMPANY: Company = {
  id: 'company-1',
  name: 'Boutique Kaboré & Fils',
  slug: 'kabore-et-fils',
  phone: '22677938688',
  description: 'Votre boutique de confiance à Ouagadougou',
  logo: '🏪',
  address: 'Secteur 15, Ouagadougou',
  coverColor: '#a04343',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isLoggedIn = signal(false);
  private _company    = signal<Company | null>(null);

  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  readonly company    = this._company.asReadonly();

  constructor(private router: Router) {
    const stored = sessionStorage.getItem('bs_auth');
    if (stored) {
      try {
        this._company.set(JSON.parse(stored));
        this._isLoggedIn.set(true);
      } catch { /* session corrompue, on ignore */ }
    }
  }

  login(phone: string, password: string): { success: boolean; error?: string } {
    if (phone === MOCK_CREDENTIALS.phone && password === MOCK_CREDENTIALS.password) {
      this._company.set(MOCK_COMPANY);
      this._isLoggedIn.set(true);
      sessionStorage.setItem('bs_auth', JSON.stringify(MOCK_COMPANY));
      return { success: true };
    }
    return { success: false, error: 'Numéro ou mot de passe incorrect.' };
  }

  register(data: RegisterPayload): { success: boolean; company: Company } {
    const slug = data.name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const company: Company = { id: 'company-' + Date.now(), slug, ...data };
    this._company.set(company);
    this._isLoggedIn.set(true);
    sessionStorage.setItem('bs_auth', JSON.stringify(company));
    return { success: true, company };
  }

  logout(): void {
    this._isLoggedIn.set(false);
    this._company.set(null);
    sessionStorage.removeItem('bs_auth');
    this.router.navigate(['/login']);
  }
}
