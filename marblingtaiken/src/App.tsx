import { HeroSection } from './components/HeroSection';
import { WhatIsMarblingSection } from './components/WhatIsMarblingSection';
import { WorkshopStepsSection } from './components/WorkshopStepsSection';
import { WhyArtSection } from './components/WhyArtSection';
import { GallerySection } from './components/GallerySection';
import { PlayableCtaSection } from './components/PlayableCtaSection';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <WhatIsMarblingSection />
      <WorkshopStepsSection />
      <WhyArtSection />
      <GallerySection />
      <PlayableCtaSection />
    </div>
  );
}
