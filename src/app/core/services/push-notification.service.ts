import { Injectable, inject, OnDestroy } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { firstValueFrom, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PushNotificationService implements OnDestroy {
  private swPush  = inject(SwPush);
  private http    = inject(HttpClient);
  private router  = inject(Router);

  private readonly apiUrl    = environment.apiUrl;
  private subscribed         = false;
  private clickSub?: Subscription;

  /**
   * Initialise le système push :
   * - Vérifie la permission
   * - S'abonne si nécessaire
   * - Envoie la subscription au backend
   * - Écoute les clics sur notification pour naviguer
   * Appeler uniquement si l'utilisateur est connecté.
   */
  async init(): Promise<void> {
    if (!this.swPush.isEnabled) {
      console.info('[Push] Service Worker non disponible (mode dev ou non HTTPS)');
      return;
    }

    // Écouter les clics notification (app ouverte)
    if (!this.clickSub) {
      this.clickSub = this.swPush.notificationClicks.subscribe(({ notification }) => {
        const url = notification.data?.url || '/orders';
        this.router.navigateByUrl(url);
      });
    }

    if (this.subscribed) return;

    if (Notification.permission === 'denied') {
      console.info('[Push] Notifications refusées par l\'utilisateur');
      return;
    }

    try {
      const vapidPublicKey = await this.getVapidPublicKey();
      if (!vapidPublicKey) return;

      const subscription = await this.swPush.requestSubscription({ serverPublicKey: vapidPublicKey });
      await this.sendSubscriptionToBackend(subscription);
      this.subscribed = true;
      console.info('[Push] Subscription enregistrée avec succès');
    } catch (err) {
      // L'utilisateur a refusé ou erreur technique — on ne relance pas
      console.info('[Push] Subscription non obtenue:', err);
    }
  }

  /**
   * À appeler lors de la déconnexion pour nettoyer les listeners.
   */
  reset(): void {
    this.subscribed = false;
  }

  ngOnDestroy(): void {
    this.clickSub?.unsubscribe();
  }

  private async getVapidPublicKey(): Promise<string | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ publicKey: string }>(`${this.apiUrl}/notifications/vapid-public-key`)
      );
      return response.publicKey;
    } catch {
      console.error('[Push] Impossible de récupérer la VAPID public key');
      return null;
    }
  }

  private async sendSubscriptionToBackend(subscription: PushSubscription): Promise<void> {
    const token = localStorage.getItem('bs_token');
    if (!token) return;

    const payload = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')),
        auth:   this.arrayBufferToBase64(subscription.getKey('auth')),
      },
    };

    await firstValueFrom(
      this.http.post(`${this.apiUrl}/notifications/subscribe`, payload)
    );
  }

  private arrayBufferToBase64(buffer: ArrayBuffer | null): string {
    if (!buffer) return '';
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(b => (binary += String.fromCharCode(b)));
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
