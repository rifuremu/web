import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../SessionContext';
import type { TagTree } from '../types';

export default function Reconstruct() {
  const navigate = useNavigate();
  const { session, updateSession } = useSession();
  const [conceptLabel, setConceptLabel] = useState('');
  const [goalEmotions, setGoalEmotions] = useState<Array<{ tag_id: string; label: string }>>([]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}tag_tree.json`)
      .then((res) => res.json())
      .then((data: TagTree) => {
        const emotion = data.emotions.find((e) => e.tag_id === session.emotion_tag);
        const need = emotion?.children?.find((n) => n.tag_id === session.need_tag);
        const concept = need?.children?.find((c) => c.tag_id === session.concept_tag);
        setConceptLabel(concept?.label || session.concept_tag);
        setGoalEmotions(data.goal_emotions);
      })
      .catch((err) => {
        console.error(err);
        alert('タグデータの読み込みに失敗しました');
      });
  }, [session.emotion_tag, session.need_tag, session.concept_tag]);

  const handleSelect = (tagId: string) => {
    updateSession({ goal_emotion_tag: tagId });
    navigate('/complete');
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        「{conceptLabel}」を大切にするあなたが、最終的に感じたい状態は何ですか？
      </p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {goalEmotions.map((ge) => (
          <button
            key={ge.tag_id}
            onClick={() => handleSelect(ge.tag_id)}
            className="rounded-full px-4 py-2 text-sm font-medium border border-emerald-300 text-emerald-800 hover:bg-emerald-100"
            aria-label={ge.label}
          >
            {ge.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleSelect('keep')}
          className="rounded-full px-4 py-2 text-sm font-medium border border-gray-300 text-gray-800 hover:bg-gray-100"
          aria-label="そのままの感情を大切にする"
        >
          そのままの感情を大切にする
        </button>
        <button
          onClick={() => handleSelect('unknown')}
          className="rounded-full px-4 py-2 text-sm font-medium border border-gray-300 text-gray-800 hover:bg-gray-100"
          aria-label="まだわからない"
        >
          まだわからない
        </button>
      </div>
    </div>
  );
}
