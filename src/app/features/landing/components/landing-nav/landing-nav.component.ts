import { Component, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-landing-nav',
  standalone: true,
  imports: [RouterLink, MatIcon],
  templateUrl: './landing-nav.component.html',
  styleUrl: './landing-nav.component.scss'
})
export class LandingNavComponent {
  menuOpen = signal(false);
  scrolled  = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }

  toggleMenu(): void { this.menuOpen.update(v => !v); }
  closeMenu(): void  { this.menuOpen.set(false); }

  scrollTo(id: string): void {
    this.closeMenu();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
