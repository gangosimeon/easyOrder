import { Component, inject } from '@angular/core';
import { SeoService, SEO_DEFAULTS } from '../../core/services/seo.service';
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
  private seo = inject(SeoService);

  constructor() {
    this.seo.setTitle(SEO_DEFAULTS.title);
    this.seo.setDescription(SEO_DEFAULTS.description);
    this.seo.setCanonical(SEO_DEFAULTS.canonical);
    this.seo.setSocial({
      title:       SEO_DEFAULTS.title,
      description: SEO_DEFAULTS.description,
      url:         SEO_DEFAULTS.canonical,
      image:       SEO_DEFAULTS.image,
    });
  }
}
