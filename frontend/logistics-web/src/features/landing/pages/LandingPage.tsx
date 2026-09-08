import { useEffect, useRef } from 'react';
import gsap from 'gsap';

import { EnterpriseArchitecture } from '../components/EnterpriseArchitecture';
import { EnterpriseFooter } from '../components/EnterpriseFooter';
import { EnterpriseHero } from '../components/EnterpriseHero';
import { EnterpriseNavbar } from '../components/EnterpriseNavbar';
import { EnterpriseRoadmap } from '../components/EnterpriseRoadmap';
import { RoleSolutionsTabs } from '../components/RoleSolutionsTabs';
import { TrustProofBar } from '../components/TrustProofBar';

import './LandingPage.css';

export function LandingPage() {
  const pageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // Subtle, clean entrance with power2.out (as recommended by ui-ux-pro-max)
      gsap.from('.hero-announcement-tag', {
        opacity: 0,
        y: -12,
        duration: 0.6,
        ease: 'power2.out',
      });

      gsap.from('.hero-main-heading', {
        opacity: 0,
        y: 20,
        duration: 0.7,
        delay: 0.1,
        ease: 'power2.out',
      });

      gsap.from('.hero-lead-text', {
        opacity: 0,
        y: 18,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out',
      });

      gsap.from('.hero-cta-buttons', {
        opacity: 0,
        y: 14,
        duration: 0.6,
        delay: 0.3,
        ease: 'power2.out',
      });

      gsap.from('.tracking-simulator-card', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        delay: 0.35,
        ease: 'power2.out',
      });

      gsap.from('.globe-card-wrapper', {
        opacity: 0,
        scale: 0.96,
        duration: 0.9,
        delay: 0.25,
        ease: 'power2.out',
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={pageRef} className="enterprise-landing-root">
      {/* Top Professional Navigation */}
      <EnterpriseNavbar onScrollTo={handleScrollTo} />

      {/* Main Content Sections */}
      <main className="landing-body">
        <EnterpriseHero />
        <TrustProofBar />
        <RoleSolutionsTabs />
        <EnterpriseArchitecture />
        <EnterpriseRoadmap />
      </main>

      {/* Enterprise Footer */}
      <EnterpriseFooter />
    </div>
  );
}
