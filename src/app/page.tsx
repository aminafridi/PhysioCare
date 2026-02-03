import { Metadata } from 'next';
import {
  Hero,
  AboutPreview,
  ServicesPreview,
  WhyUs,
  Testimonials,
  BlogPreview,
  CTABanner,
} from '@/components/sections';

export const metadata: Metadata = {
  title: 'ElitePhysio - Restore Your Movement',
  description:
    'Experience world-class physiotherapy tailored to your recovery and performance goals. We blend advanced science with compassionate care.',
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <ServicesPreview />
      <WhyUs />
      <Testimonials />
      <BlogPreview />
      <CTABanner />
    </>
  );
}
