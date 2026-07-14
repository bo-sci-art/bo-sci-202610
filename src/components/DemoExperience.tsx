import { useState } from 'react';
import { MapPin, Check, Users } from 'lucide-react';
import { RiChatSmile2Line } from "react-icons/ri";
import { LuPaintBucket } from "react-icons/lu";
import { PiHandTap } from "react-icons/pi";
import mablingVideo from '../videos/marbling.mp4';
import chatVideo from '../videos/chat.mp4'; 
import mapVideo from '../videos/map.mp4';

type DemoStep = 'alert' | 'map' | 'safety';

export function DemoExperience() {
  const [activeStep, setActiveStep] = useState<DemoStep>('alert');
  const [isAlertActive, setIsAlertActive] = useState(false); // この変数は未使用ですが、元のコードのまま残します
  const [safetyStatus, setSafetyStatus] = useState<{ [key: string]: boolean }>({});
  // safetyStatus と familyMembers は 'safety' セクションの仕様変更により不要になりますが、元のコードから削除はせず未使用として残しておきます
  const familyMembers = ['お父さん', 'お母さん', '妹'];

  const handleSafetyCheck = (member: string) => {
    setSafetyStatus(prev => ({
      ...prev,
      [member]: !prev[member]
    }));
  };

  return (
    <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <PiHandTap className="text-orange-600 text-lg" />
            <h2 className="text-gray-900 text-base sm:text-lg font-medium">
              ツールを体験してみてください！
            </h2>
          </div>
          <p className="text-gray-600">
            ワークショップの体験を<br />“少しだけ”お届け！
          </p>
        </div>

        {/* セグメントコントロール型タブ */}
        <div className="w-full max-w-2xl mx-auto mb-8">
          <div className="flex rounded-full border border-orange-300 bg-orange-50 overflow-hidden">
            
            {/* マーブリング */}
            <button
              onClick={() => setActiveStep('alert')}
              className={`flex-1 flex flex-col items-center justify-center py-3 text-xs sm:text-sm font-semibold transition-colors
                ${activeStep === 'alert'
                  ? 'bg-orange-600 text-white'
                  : 'text-orange-600 hover:bg-orange-100'
                }`}
            >
              <LuPaintBucket className="w-5 h-5 mb-0.5" />
              マーブリング
            </button>

            {/* 防災行動マップ */}
            <button
              onClick={() => setActiveStep('map')}
              className={`flex-1 flex flex-col items-center justify-center py-3 text-xs sm:text-sm font-semibold transition-colors border-l border-orange-300
                ${activeStep === 'map'
                  ? 'bg-orange-600 text-white'
                  : 'text-orange-600 hover:bg-orange-100'
                }`}
            >
              <MapPin className="w-5 h-5 mb-0.5" />
              防災行動マップ
            </button>

            {/* ご近所アートチャット */}
            <button
              onClick={() => setActiveStep('safety')}
              className={`flex-1 flex flex-col items-center justify-center py-3 text-xs sm:text-sm font-semibold transition-colors border-l border-orange-300
                ${activeStep === 'safety'
                  ? 'bg-orange-600 text-white'
                  : 'text-orange-600 hover:bg-orange-100'
                }`}
            >
              <RiChatSmile2Line className="w-5 h-5 mb-0.5" />
              ご近所アートチャット
            </button>

          </div>
        </div>



        {/* デモコンテンツ */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* スマホ風フレームのヘッダー */}
          <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
            <span className="text-sm">9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-white/30 rounded-full"></div>
              <div className="w-4 h-4 bg-white/30 rounded-full"></div>
              <div className="w-4 h-4 bg-white/30 rounded-full"></div>
            </div>
          </div>

          {/* ======== マーブリングセクション (activeStep === 'alert') ======== */}
          {activeStep === 'alert' && (
            <div className="p-6 space-y-6">
              {/* 1. 簡単な説明セクション (動画の上) */}
              <div className="text-center space-y-2">
                <h3 className="text-gray-900 font-bold text-xl">
                  マーブリング
                </h3>
                <p className="text-gray-600 text-sm">
                  説明
                </p>
              </div>

              {/* 2. スマホ風フレーム内の動画表示（mabling.mp4を直接表示） */}
              <div className="relative rounded-lg overflow-hidden shadow-xl border-4 border-gray-100/50">
                <div className="aspect-video bg-gray-700 flex items-center justify-center">
                  <video
                    src={mablingVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* 3. 「体験する」ボタン (動画の下) */}
              <a
                href="marblingtaiken/index.html"
                className="w-full inline-flex items-center justify-center gap-2 
                          bg-orange-600 text-white font-bold text-lg 
                          px-6 py-4 rounded-xl shadow-lg 
                          hover:bg-orange-700 transition-all transform hover:scale-[1.03]
                          focus:outline-none focus:ring-4 focus:ring-orange-300 active:bg-orange-800
                          animate-bounce animate-once hover:animate-none"
              >
                <PiHandTap className="w-6 h-6" />
                マーブリングを体験する！
              </a>
            </div>
          )}
          {/* ========================================================== */}

          {activeStep === 'map' && (
            <div className="p-6 space-y-6">
              {/* 1. 簡単な説明セクション (動画の上) */}
              <div className="text-center space-y-2">
                <h3 className="text-gray-900 font-bold text-xl">
                  防災行動マップ
                </h3>
                <p className="text-gray-600 text-sm">
                  地域のみんなの作品を鑑賞できます！
                </p>
              </div>

              {/* 2. スマホ風フレーム内の動画表示（mapVideoを表示） */}
              <div className="relative rounded-lg overflow-hidden shadow-xl border-4 border-gray-100/50">
                <div className="bg-gray-700 flex items-center justify-center h-[400px]"> 
                  <video
                    src={mapVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <a
                href="maptaiken/index.html" 
                className="w-full inline-flex items-center justify-center gap-2 
                          bg-orange-600 text-white font-bold text-lg 
                          px-6 py-4 rounded-xl shadow-lg 
                          hover:bg-orange-700 transition-all transform hover:scale-[1.03]
                          focus:outline-none focus:ring-4 focus:ring-orange-300 active:bg-orange-800
                          animate-bounce animate-once hover:animate-none"
              >
                <PiHandTap className="w-6 h-6" />
                防災行動マップを見る！
              </a>
            </div>
          )}

          {/* ======== ご近所アートチャットセクション (activeStep === 'safety') ======== */}
          {/* マーブリングと同じ表示内容に変更 */}
          {activeStep === 'safety' && (
            <div className="p-6 space-y-6">
              {/* 1. 簡単な説明セクション (動画の上) */}
              <div className="text-center space-y-2">
                <h3 className="text-gray-900 font-bold text-xl">
                  ご近所アートチャット
                </h3>
                <p className="text-gray-600 text-sm">
                  作品に共感を届けたり、<br/>地域の声を見ることができます！
                </p>
              </div>

              {/* 2. スマホ風フレーム内の動画表示（chatVideoを直接表示） */}
              <div className="relative rounded-lg overflow-hidden shadow-xl border-4 border-gray-100/50">
                <div className="bg-gray-700 flex items-center justify-center h-[400px]"> 
                  <video
                    src={chatVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* 3. 「体験する」ボタン (動画の下) */}
              <a
                href="gptaiken/index.html"
                className="w-full inline-flex items-center justify-center gap-2 
                          bg-orange-600 text-white font-bold text-lg 
                          px-6 py-4 rounded-xl shadow-lg 
                          hover:bg-orange-700 transition-all transform hover:scale-[1.03]
                          focus:outline-none focus:ring-4 focus:ring-orange-300 active:bg-orange-800
                          animate-bounce animate-once hover:animate-none"
              >
                <PiHandTap className="w-6 h-6" />
                地域の声を見る！
              </a>
            </div>
          )}
          {/* ========================================================== */}
        </div>
      </div>
    </section >
  );
}