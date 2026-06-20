import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { LandingNavComponent }      from './components/landing-nav/landing-nav.component';
import { HeroComponent }            from './components/hero/hero.component';
import { HowItWorksComponent }      from './components/how-it-works/how-it-works.component';
import { FeaturesSectionComponent } from './components/features-section/features-section.component';
import { ForWhoComponent }          from './components/for-who/for-who.component';
import { VideoContactComponent }    from './components/video-contact/video-contact.component';
import { TestimonialsComponent }    from './components/testimonials/testimonials.component';
import { PricingComponent }         from './components/pricing/pricing.component';
import { CtaBannerComponent }       from './components/cta-banner/cta-banner.component';
import { LandingFooterComponent }   from './components/landing-footer/landing-footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    LandingNavComponent,
    HeroComponent,
    HowItWorksComponent,
    FeaturesSectionComponent,
    ForWhoComponent,
    VideoContactComponent,
    // TestimonialsComponent,
    // PricingComponent,
    CtaBannerComponent,
    LandingFooterComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  private meta = inject(Meta);
  private title = inject(Title);

  constructor() {
    this.title.setTitle('JeCreeMaBoutique — Créez votre boutique en ligne gratuitement');
    this.meta.updateTag({
      name: 'description',
      content: 'Créez votre boutique, partagez votre lien et commencez à vendre dès aujourd’hui. Gestion facile des produits, commandes via WhatsApp, boutique publique accessible 24/7.'
    });
    this.meta.updateTag({
      property: 'og:title',
      content: 'JeCreeMaBoutique — Créez votre boutique en ligne gratuitement'
    });
    this.meta.updateTag({
      property: 'og:description',
      content: 'Créez votre boutique, partagez votre lien et commencez à vendre dès aujourd’hui. Gestion facile des produits, commandes via WhatsApp.'
    });
  }
}
