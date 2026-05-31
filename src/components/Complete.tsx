import { useNavigate } from 'react-router-dom';
import { useSession } from '../SessionContext';
import { useState, useEffect } from 'react';
import type { TagTree } from '../types';

export default function Complete() {
  const navigate = useNavigate();
  const { session, resetSession } = useSession();
  const [labels, setLabels] = useState({
    emotion: '',
    need: '',
    concept: '',
    goal: '',
  });

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}tag_tree.json`)
      .then((res) => res.json())
      .then((data: TagTree) => {
        const emotion = data.emotions.find((e) => e.tag_id === session.emotion_tag);
        const need = emotion?.children?.find((n) => n.tag_id === session.need_tag);
        const concept = need?.children?.find((c) => c.tag_id === session.concept_tag);
        const goal = data.goal_emotions.find((g) => g.tag_id === session.goal_emotion_tag);
        setLabels({
          emotion: emotion?.label || session.emotion_tag,
          need: need?.label || session.need_tag,
          concept: concept?.label || session.concept_tag,
          goal: goal?.label || session.goal_emotion_tag || '',
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [session.emotion_tag, session.need_tag, session.concept_tag, session.goal_emotion_tag]);

  const handleHome = () => {
    resetSession();
    navigate('/');
  };

  const shareUrl = 'https://rifuremu.github.io/web/';
  const shareText = '損失回避バイアスをPCTとMOLで相殺するトレーニング『Rifuremu』でセッションを完了しました';

  const handleShareX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareLine = () => {
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4 text-center">
      <h2 className="text-xl font-bold text-gray-800">完了</h2>
      <div className="text-sm text-gray-800 space-y-1">
        <p>感情：{labels.emotion}</p>
        <p>欲求：{labels.need}</p>
        <p>コンセプト：{labels.concept}</p>
        <p>到達：{labels.goal}</p>
      </div>
      <p className="text-sm text-gray-600">
        この経路を確認しました。
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={handleShareX}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
          aria-label="Xでシェア"
        >
          <svg className="w-4 h-4" aria-hidden="true">
            <use href={`${import.meta.env.BASE_URL}icons.svg#x-icon`} />
          </svg>
          Xでシェア
        </button>
        <button
          onClick={handleShareLine}
          className="inline-flex items-center gap-2 bg-[#06C755] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#05a649] transition-colors"
          aria-label="LINEでシェア"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 5.9 2 10.7c0 2.85 1.74 5.36 4.37 6.82.19.1.31.29.28.49l-.17 1.01c-.05.29.25.52.51.38l1.78-.96c.15-.08.32-.1.48-.06 1.08.29 2.24.45 3.45.45h.6c.21 0 .42-.01.62-.03 4.58-.49 8.08-3.91 8.08-8.14C22 5.9 17.52 2 12 2zm-1.34 11.9H9.05V8.56h1.61v5.34zm3.26 0h-1.61V8.56h1.61v5.34zm-4.87 0H7.5V8.56h1.55v5.34zm6.49 0h-1.61v-2.67h-1.07v2.67h-1.61V8.56h3.88v1.07h-1.27v1.6h1.27v1.07h-1.27v1.6h1.27v1z" />
          </svg>
          LINEでシェア
        </button>
      </div>
      <button
        onClick={handleHome}
        className="bg-gray-800 text-white px-6 py-3 rounded-full font-medium"
        aria-label="ホームへ"
      >
        ホームへ
      </button>
    </div>
  );
}
