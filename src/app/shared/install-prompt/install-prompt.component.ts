import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PwaInstallService } from '../../core/services/pwa-install.service';

@Component({
  selector: 'app-install-prompt',
  standalone: true,
  imports: [MatIconModule],
  template: `
    @if (pwaInstall.canInstall()) {
      <div class="install-prompt" role="status">
        <img class="install-icon" src="assets/icons/web-app-manifest-192x192.png" alt="" />
        <div class="install-text">
          <strong>Installer JeCreeMaBoutique</strong>
          <span>Accès rapide depuis l'écran d'accueil</span>
        </div>
        <button type="button" class="install-btn" (click)="pwaInstall.promptInstall()">Installer</button>
        <button type="button" class="install-close" (click)="pwaInstall.dismiss()" aria-label="Fermer">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    .install-prompt {
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 420px;
      margin: 14px auto;
      padding: 10px 12px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
      animation: installSlide 0.25s ease;
    }

    @keyframes installSlide {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .install-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      flex-shrink: 0;
    }

    .install-text {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;

      strong { font-size: 13px; font-weight: 700; color: #1a1a2e; line-height: 1.3; }
      span   { font-size: 11.5px; color: #6b7280; line-height: 1.3; }
    }

    .install-btn {
      flex-shrink: 0;
      height: 34px;
      padding: 0 16px;
      border: none;
      border-radius: 10px;
      background: var(--primary, #008060);
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.15s;
      &:hover { opacity: 0.9; }
    }

    .install-close {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      border: none;
      background: none;
      color: #9ca3af;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 50%;
      transition: background 0.15s;

      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover { background: #f3f4f6; }
    }
  `],
})
export class InstallPromptComponent {
  readonly pwaInstall = inject(PwaInstallService);
}
