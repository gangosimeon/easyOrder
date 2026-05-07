import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  private scroller = inject(ViewportScroller);

  readonly mockProducts = ['Sac tendance', 'Montre élégante', 'Chaussures', 'Lunettes'];

  scrollToDemo(): void {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  }
}
