import { Component } from '@angular/core';
import { LandingNavComponent }      from './components/landing-nav/landing-nav.component';
import { HeroComponent }            from './components/hero/hero.component';
import { HowItWorksComponent }      from './components/how-it-works/how-it-works.component';
import { FeaturesSectionComponent } from './components/features-section/features-section.component';
import { ForWhoComponent }          from './components/for-who/for-who.component';
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
    // TestimonialsComponent,
    // PricingComponent,
    CtaBannerComponent,
    LandingFooterComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {}
