import { ImageWithFallback } from './figma/ImageWithFallback';
import { Map, Home } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background marbling image */}
      <div className="relative h-[60vh] flex items-center justify-center">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1759184966965-34ee0ada3162?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJibGluZyUyMGFydCUyMGNvbG9yZnVsfGVufDF8fHx8MTc2NTI2OTY3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Marbling art background"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white"></div>
        
        {/* Floating icons */}
        <div className="absolute top-20 right-8 bg-white p-3 rounded-full shadow-lg opacity-80">
          <Map className="w-6 h-6 text-blue-500" />
        </div>
        <div className="absolute top-32 left-8 bg-white p-3 rounded-full shadow-lg opacity-80">
          <Home className="w-6 h-6 text-purple-500" />
        </div>
        
        {/* Hero content */}
        <div className="relative z-10 px-6 text-center">
          <h1 className="mb-4 text-gray-900">
            マーブリングで、<br />
            あなたの街の<br />
            "災害リスク"を<br />
            描いてみよう
          </h1>
          <p className="text-gray-700 max-w-md mx-auto">
            ハザードマップで見つけた災害リスクへの気づきを、色と模様のアートとして表現します。
          </p>
        </div>
      </div>
      
      {/* "What you'll learn" section */}
      <div className="bg-gradient-to-b from-purple-50 to-white px-6 py-8">
        <p className="text-sm text-gray-600 mb-4 text-center">このページでわかること</p>
        <ul className="space-y-2 max-w-sm mx-auto">
          <li className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></div>
            <span>マーブリングってどんな表現？</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></div>
            <span>ワークショップで何をするの？</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 flex-shrink-0"></div>
            <span>どうしてアートで防災を考えるの？</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
