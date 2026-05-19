import { Component, inject, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements AfterViewInit {
  private router = inject(Router);

  ngAfterViewInit(): void {
    // Auto-redirect après 3 secondes
    setTimeout(() => {
      this.goToLogin();
    }, 3000);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
