import { ArrowRight, Sparkles } from 'lucide-react';

export function PlayableCtaSection() {
  return (
    <section className="px-6 py-12 bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="max-w-lg mx-auto">
        {/* Icon decoration */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-purple-400 to-blue-400 w-16 h-16 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        
        {/* Section header */}
        <h2 className="text-center mb-4">
          まずは、スマホで<br />
          "手ざわり"だけ<br />
          体験してみませんか？
        </h2>
        
        {/* Description */}
        <p className="text-center text-gray-700 mb-8 leading-relaxed">
          本番のワークショップでは、ハザードマップを見ながら作品づくりを行います。<br />
          ここからは、その前にマーブリングの感覚だけ少し試してみることができます。
        </p>
        
        {/* CTA Button */}
        <button
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
          onClick={() => {
            // This can be connected to actual link/navigation later
            window.location.href = '/taiken.html';
            console.log('Navigate to playable experience');
          }}
        >
          <span>マーブリングを少し体験してみる</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          体験は数分で完了します
        </p>
      </div>
      
      {/* Bottom spacing */}
      <div className="h-8"></div>
    </section>
  );
}
