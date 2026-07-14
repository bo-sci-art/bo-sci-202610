import { ImageWithFallback } from './figma/ImageWithFallback';

export function GallerySection() {
  // Placeholder images - easy to replace later
  const artworks = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1713813091326-6e455416f31c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHdhdGVyY29sb3IlMjB0ZXh0dXJlfGVufDF8fHx8MTc2NTI2OTY3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'マーブリング作品例 1',
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1559762759-d4dddb38c2a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludCUyMHN3aXJsJTIwcGF0dGVybnxlbnwxfHx8fDE3NjUyNjk2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'マーブリング作品例 2',
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1561211919-1947abbbb35b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGluayUyMHdhdGVyfGVufDF8fHx8MTc2NTI2OTY4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'マーブリング作品例 3',
    },
  ];

  return (
    <section className="px-6 py-12 bg-white">
      <div className="max-w-lg mx-auto">
        {/* Section header */}
        <h2 className="text-center mb-2">
          実際の作品イメージ
        </h2>
        <div className="h-1 w-24 mx-auto mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full"></div>
        
        {/* Description */}
        <p className="text-center text-gray-700 mb-8 leading-relaxed">
          当日のワークショップでは、参加者それぞれが<br />
          <span className="text-purple-600">「自分の街の災害リスク」</span>をテーマに、<br />
          マーブリング作品を制作します。
        </p>
        
        {/* Gallery - Horizontal scroll on mobile */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-6 px-6">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="flex-shrink-0 w-[280px] snap-center"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
                <ImageWithFallback
                  src={artwork.src}
                  alt={artwork.alt}
                  className="w-full h-[280px] object-cover"
                />
                <div className="p-4 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
                  <p className="text-sm text-gray-600 text-center">
                    {artwork.alt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          ※画像はイメージです。実際のワークショップで制作する作品とは異なります。
        </p>
      </div>
    </section>
  );
}
