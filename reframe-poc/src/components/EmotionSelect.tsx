import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../SessionContext';
import type { TagTree, TagTreeNode } from '../types';

export default function EmotionSelect() {
  const navigate = useNavigate();
  const { updateSession } = useSession();
  const [emotions, setEmotions] = useState<TagTreeNode[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}tag_tree.json`)
      .then((res) => res.json())
      .then((data: TagTree) => setEmotions(data.emotions))
      .catch((err) => {
        console.error(err);
        alert('タグデータの読み込みに失敗しました');
      });
  }, []);

  const handleSelect = (emotion: TagTreeNode) => {
    updateSession({
      emotion_tag: emotion.tag_id,
      valence: emotion.valence || 'negative',
    });
    navigate('/writing');
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
        今、あなたの胸にある感情は？
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {emotions.map((emotion) => (
          <button
            key={emotion.tag_id}
            onClick={() => handleSelect(emotion)}
            className={`rounded-full px-3 py-2 text-sm font-medium border transition-colors
              ${emotion.valence === 'positive'
                ? 'border-blue-300 text-blue-800 hover:bg-blue-100'
                : 'border-red-300 text-red-800 hover:bg-red-100'
              }`}
            aria-label={emotion.label}
          >
            {emotion.label}
          </button>
        ))}
      </div>
    </div>
  );
}
