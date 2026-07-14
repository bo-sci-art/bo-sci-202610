import { Hero } from './components/Hero';
import { ImageSlideshow } from './components/ImageSlideshow';
import { ReviewsCarousel } from './components/ReviewsCarousel';
import { RecommendedSection } from './components/RecommendedSection';
import { DemoExperience } from './components/DemoExperience';
import { WorkshopDetails } from './components/WorkshopDetails';
import { FixedApplyButton } from './components/FixedApplyButton';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <>
      <div className="min-h-screen bg-white">
        <Hero />
        <ImageSlideshow />
        <ReviewsCarousel />
        {/* ここに「こんな方におすすめ！」を挿入 */}
        <RecommendedSection />
        <DemoExperience />
        <WorkshopDetails />
        <Footer />
        <FixedApplyButton />
        {/* 固定ボタンと下部コンテンツの干渉防止 */}
        <div className="h-20"></div>
      </div>
    </>
  );
}