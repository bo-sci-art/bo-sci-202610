'use client';

import { useState } from 'react';
import { Calendar, Clock, Users, Wallet } from 'lucide-react';
import { LuPenLine } from "react-icons/lu";
import { BiCommentDetail } from "react-icons/bi";
import mapImage1 from '../images/map.png';
import mapImage2 from '../images/map2.png';
import mapImageYagami from '../images/yagami_map.png';  // ← 矢上キャンパスの正しい地図に差し替え

interface CurriculumItem {
  title: string;
  time: string;
  location: string;
  description: string;
  mapImage: string;
}

const details = [
  {
    icon: Calendar,
    label: '開催日時',
    value: '2026年10月18日（日）',
  },
  {
    icon: Users,
    label: '対象',
    value:
      '港北区内在住の18歳以上の方<br/>（18歳未満のお子様の同伴可。小さいお子様向けに保育対応も行う予定です。）',
  },
  {
    icon: LuPenLine,
    label: '持ち物',
    value: '飲み物をご持参ください。',
  },
  {
    icon: Wallet,
    label: '費用',
    value: '<span class="text-lg font-semibold">無料</span>',
  },
];

const curriculum: CurriculumItem[] = [
  {
    title: '第１ターム',
    time: '10:30-12:15',
    location: '慶應義塾大学矢上キャンパス（創想館 ディスカッションルーム7）',
    description:
      '場所：</br><span class="text-lg font-semibold">慶應義塾大学矢上キャンパス（創想館 ディスカッションルーム7）</span><br/><span class="text-sm text-gray-500">※当日案内人がいますので、矢上キャンパスにお越しください</span>',
    mapImage: mapImageYagami, // ⚠️矢上キャンパスの地図に差し替え要
  },
  {
    title: '第２ターム',
    time: '13:30-15:15',
    location: 'Be ACTO 日吉 まちのスタジオ',
    description:
      '場所：</br><span class="text-lg font-semibold">Be ACTO 日吉<br/>まちのスタジオ</span>',
    mapImage: mapImage1,
  },
  {
    title: '第３ターム',
    time: '15:30-17:15',
    location: 'Be ACTO 日吉 まちのスタジオ',
    description:
      '場所：</br><span class="text-lg font-semibold">Be ACTO 日吉<br/>まちのスタジオ</span>',
    mapImage: mapImage1,
  },
];

export function WorkshopDetails() {
  const [selectedItem, setSelectedItem] = useState<CurriculumItem | null>(null);

  const openPopup = (item: CurriculumItem) => {
    setSelectedItem(item);
    document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    setSelectedItem(null);
    document.body.style.overflow = '';
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center items-center gap-2 mb-4">
          <BiCommentDetail className="w-6 h-6 text-orange-600" />
          <h3 className="text-gray-900 text-center text-lg font-semibold">
            ワークショップ詳細
          </h3>
        </div>

        <p className="text-center text-gray-600 mb-6 text-sm">
          ご参加お待ちしております！
        </p>

        {/* 開催概要 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {details.map((detail, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <detail.icon className="w-5 h-5 text-orange-600" />
                <span className="text-gray-600 text-sm">{detail.label}</span>
              </div>

              {detail.label === '開催日時' ? (
                <>
                  {/* 日付（既存の value） */}
                  <p
                    className="text-gray-900 mb-4"
                    dangerouslySetInnerHTML={{ __html: detail.value }}
                  />

                  {/* ターム一覧＋場所＋地図ボタン */}
                  <div className="space-y-3">
                    {curriculum.map((item) => (
                      <div
                        key={item.title}
                        className="border-t border-gray-200 pt-2 first:border-t-0 first:pt-0"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-1 text-sm text-gray-800">
                          <span className="font-semibold">{item.title}</span>
                          <span className="text-gray-600">{item.time}</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                          <span className="text-xs text-gray-600">
                            {item.location}
                          </span>
                          <button
                            type="button"
                            onClick={() => openPopup(item)}
                            className="text-orange-600 underline underline-offset-2 hover:text-orange-700 text-xs whitespace-nowrap"
                          >
                            地図
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 時間帯の選択方法についての案内 */}
                  <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                    ①〜③の中から、ご都合のつく時間帯を複数お選びいただけます。<br />
                    いただいたご希望をもとに調整し、参加時間をあらためてご連絡いたします。
                  </p>
                </>
              ) : (
                // 他のカード（持ち物・対象など）は今まで通り
                <p
                  className="text-gray-900"
                  dangerouslySetInnerHTML={{ __html: detail.value }}
                />
              )}
            </div>
          ))}
        </div>

        {/* 🔽 ここを追加 🔽 */}
        {selectedItem && (
          <PopupModal item={selectedItem} onClose={closePopup} />
        )}
      </div>
    </section>
  );
}

interface PopupModalProps {
  item: CurriculumItem;
  onClose: () => void;
}

const PopupModal: React.FC<PopupModalProps> = ({ item, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative transform transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="mb-4">
          <div className="bg-orange-600 text-white px-3 py-1 rounded text-sm whitespace-nowrap inline-block mb-2">
            {item.time}
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-1">
            {item.title}
          </h4>
        </div>

        <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 shadow-md">
          <img
            src={item.mapImage}
            alt={`会場地図: ${item.title}`}
            className="w-full h-auto object-cover"
          />
        </div>

        <p
          className="text-gray-700 text-md leading-relaxed"
          dangerouslySetInnerHTML={{ __html: item.description }}
        />
      </div>
    </div>
  );
};

const RecommendItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start gap-3">
    <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="text-white text-sm">✓</span>
    </div>
    <p className="text-gray-700">{text}</p>
  </div>
);
