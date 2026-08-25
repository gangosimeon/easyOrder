import { Injectable, signal } from '@angular/core';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'bs_pwa_install_dismissed';

@Injectable({ providedIn: 'root' })
export class PwaInstallService {
  private deferredEvent: BeforeInstallPromptEvent | null = null;
  private readonly _canInstall = signal(false);
  readonly canInstall = this._canInstall.asReadonly();

  constructor() {
    if (this.isStandalone() || this.isDismissed()) return;

    window.addEventListener('beforeinstallprompt', (event: Event) => {
      event.preventDefault();
      this.deferredEvent = event as BeforeInstallPromptEvent;
      this._canInstall.set(true);
    });

    window.addEventListener('appinstalled', () => {
      this.deferredEvent = null;
      this._canInstall.set(false);
    });
  }

  private isStandalone(): boolean {
    return window.matchMedia?.('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true;
  }

  private isDismissed(): boolean {
    try { return localStorage.getItem(DISMISSED_KEY) === '1'; } catch { return false; }
  }

  async promptInstall(): Promise<void> {
    if (!this.deferredEvent) return;
    const event = this.deferredEvent;
    this.deferredEvent = null;
    this._canInstall.set(false);
    await event.prompt();
    await event.userChoice;
  }

  dismiss(): void {
    this._canInstall.set(false);
    try { localStorage.setItem(DISMISSED_KEY, '1'); } catch { /* ignore */ }
  }
}
