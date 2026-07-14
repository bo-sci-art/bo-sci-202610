import { AiOutlineSmile } from "react-icons/ai";

const RecommendItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start gap-3">
    <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="text-white text-sm">✓</span>
    </div>
    <p className="text-gray-700">{text}</p>
  </div>
);

export function RecommendedSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* 見出し */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <AiOutlineSmile className="w-6 h-6 text-orange-600" />
          <h3 className="text-gray-900 text-center text-lg font-semibold">
            こんな方におすすめ
          </h3>
        </div>

        <p className="text-center text-gray-600 mb-6 text-sm">
          下記以外でも、どんな方でも安心してご参加できます
        </p>

        {/* おすすめリスト */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RecommendItem text="防災に関心があるけど、学ぶ機会が少ない方" />
            <RecommendItem text="日々忙しくて、防災を考える時間が取れない方" />
            <RecommendItem text="子どもと防災に関して話し合ってみたい方" />
            <RecommendItem text="地域の同じ防災意識を持った仲間と繋がりたい方" />
          </div>
        </div>
      </div>
    </section>
  );
}
