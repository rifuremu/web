import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../SessionContext';
import type { TagTree, TagTreeNode } from '../types';

export default function NeedSelect() {
  const navigate = useNavigate();
  const { session, updateSession } = useSession();
  const [needs, setNeeds] = useState<TagTreeNode[]>([]);
  const [emotionLabel, setEmotionLabel] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}tag_tree.json`)
      .then((res) => res.json())
      .then((data: TagTree) => {
        const emotion = data.emotions.find((e) => e.tag_id === session.emotion_tag);
        setEmotionLabel(emotion?.label || session.emotion_tag);
        setNeeds(emotion?.children || []);
      })
      .catch((err) => {
        console.error(err);
        alert('タグデータの読み込みに失敗しました');
      });
  }, [session.emotion_tag]);

  const handleSelect = (need: TagTreeNode) => {
    updateSession({ need_tag: need.tag_id });
    navigate('/concept');
  };

  const preview = session.raw_text.slice(0, 15) + (session.raw_text.length > 15 ? '…' : '');

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        「{preview}」という{emotionLabel}の奥には…
      </p>
      <div className="space-y-3">
        {needs.map((need) => (
          <button
            key={need.tag_id}
            onClick={() => handleSelect(need)}
            className="w-full rounded-full px-4 py-3 text-sm font-medium border border-gray-300 text-gray-800 hover:bg-gray-100 text-left"
            aria-label={need.label}
          >
            {need.label}
          </button>
        ))}
      </div>
    </div>
  );
}
