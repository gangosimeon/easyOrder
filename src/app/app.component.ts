import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatRippleModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly navItems: NavItem[] = [
    { label: 'Catégories', icon: 'category',    route: '/categories' },
    { label: 'Produits',   icon: 'inventory_2', route: '/products'   },
    { label: 'Annonces',   icon: 'campaign',    route: '/annonces'   },
  ];
}
