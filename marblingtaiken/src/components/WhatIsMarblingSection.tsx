import { Droplet, Hand, FileImage } from 'lucide-react';

export function WhatIsMarblingSection() {
  const steps = [
    {
      icon: Droplet,
      label: 'インクを落とす',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Hand,
      label: '指でなぞる',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: FileImage,
      label: '模様ができる',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
    },
  ];

  return (
    <section className="px-6 py-12 bg-white">
      <div className="max-w-lg mx-auto">
        {/* Section header with colorful underline */}
        <h2 className="text-center mb-2">
          マーブリングってなに？
        </h2>
        <div className="h-1 w-24 mx-auto mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"></div>
        
        {/* Description */}
        <div className="bg-gradient-to-br from-purple-50/50 to-blue-50/50 rounded-2xl p-6 mb-8">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-purple-500 mt-1">●</span>
              <span>水面などにインクを落として</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">●</span>
              <span>指や道具でゆらしたり、混ぜたりして</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-pink-500 mt-1">●</span>
              <span>できた模様を紙や画面に写しとる表現です。</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            デジタル版では、画面の上で「にじむ・まざる・広がる」感覚を楽しめます。
          </p>
        </div>
        
        {/* Visual steps */}
        <div className="grid grid-cols-3 gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className={`${step.bgColor} w-16 h-16 rounded-full flex items-center justify-center`}>
                  <Icon className={`w-8 h-8 ${step.color}`} />
                </div>
                <p className="text-xs text-center text-gray-600">{step.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
