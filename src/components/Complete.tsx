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
