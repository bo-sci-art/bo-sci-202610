import { Smile, Heart, MessageCircle } from 'lucide-react';

export function WhyArtSection() {
  const benefits = [
    {
      icon: Smile,
      title: '楽しく・気軽に始められる',
      description: '絵が得意じゃなくても大丈夫。色や動きを使って、遊ぶような感覚で始められます。',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      icon: Heart,
      title: '自分の感情やイメージを外に出せる',
      description: '『ここがちょっと不安』『ここは危なそう』と感じたことを、言葉だけでなく色や模様でも表現できます。',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
    },
    {
      icon: MessageCircle,
      title: '作品をきっかけに話しやすくなる',
      description: '地図や数字だけよりも、作品を見ながら『ここが気になる』と話しやすくなり、防災の対話が生まれます。',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
  ];

  return (
    <section className="px-6 py-12 bg-gradient-to-b from-white to-purple-50/30">
      <div className="max-w-lg mx-auto">
        {/* Section header */}
        <h2 className="text-center mb-2">
          どうして"アート"で<br />
          防災を考えるの？
        </h2>
        <div className="h-1 w-24 mx-auto mb-10 bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 rounded-full"></div>
        
        {/* Benefits cards */}
        <div className="space-y-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 shadow-sm border ${benefit.borderColor}`}
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className={`${benefit.bgColor} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${benefit.color}`} />
                  </div>
                  <h3 className="text-lg pt-2">{benefit.title}</h3>
                </div>
                <p className="text-gray-700 pl-16">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
