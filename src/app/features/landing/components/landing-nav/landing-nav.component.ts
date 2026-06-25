import { Component, HostListener, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-landing-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing-nav.component.html',
  styleUrl: './landing-nav.component.scss'
})
export class LandingNavComponent {
  private router = inject(Router);
  menuOpen  = signal(false);
  scrolled  = signal(false);
  activeTab = signal<string>('');

  constructor() {
    const fromUrl     = this.router.url.startsWith('/shops') ? 'shops' : '';
    const fromStorage = sessionStorage.getItem('landing_active_tab') ?? '';
    const initial     = fromUrl || fromStorage;
    this.activeTab.set(initial);
    if (fromUrl) sessionStorage.setItem('landing_active_tab', 'shops');
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }

  toggleMenu(): void { this.menuOpen.update(v => !v); }
  closeMenu(): void  { this.menuOpen.set(false); }

  scrollTo(id: string): void {
    this.closeMenu();
    this.activeTab.set(id);
    sessionStorage.setItem('landing_active_tab', id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigate(['/'], { fragment: id });
    }
  }

  goToShops(): void {
    this.closeMenu();
    this.activeTab.set('shops');
    sessionStorage.setItem('landing_active_tab', 'shops');
    setTimeout(() => this.router.navigate(['/shops']));
  }
}
