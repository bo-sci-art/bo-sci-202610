import { Map, Palette } from 'lucide-react';

export function WorkshopStepsSection() {
  return (
    <section className="px-6 py-12 bg-gradient-to-b from-blue-50/30 to-white">
      <div className="max-w-lg mx-auto">
        {/* Section header */}
        <h2 className="text-center mb-2">
          ワークショップでは、<br />
          こんなふうに使います
        </h2>
        <div className="h-1 w-24 mx-auto mb-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
        
        {/* Step 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              Step 1
            </div>
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg">ハザードマップを見る</h3>
            </div>
          </div>
          <p className="text-gray-700">
            ご自身が住んでいる周辺のハザードマップを見ながら、<br />
            <span className="text-blue-600">「どこが危なそう？」「どんな災害が起こりうる？」</span><br />
            と気づきを見つけます。
          </p>
        </div>
        
        {/* Step 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
              Step 2
            </div>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg">マーブリングで表現する</h3>
            </div>
          </div>
          <p className="text-gray-700 mb-3">
            ハザードマップから気づいた災害リスクを、色やかたちのイメージに置きかえてマーブリングで表現します。
          </p>
          <p className="text-sm text-gray-600">
            不安や違和感、危なそうだと感じたところを、自由な模様として描き出します。
          </p>
        </div>
      </div>
    </section>
  );
}
