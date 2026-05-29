import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../SessionContext';
import type { TagTree } from '../types';

export default function Writing() {
  const navigate = useNavigate();
  const { session, updateSession } = useSession();
  const [text, setText] = useState(session.raw_text);
  const [emotionLabel, setEmotionLabel] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}tag_tree.json`)
      .then((res) => res.json())
      .then((data: TagTree) => {
        const emotion = data.emotions.find((e) => e.tag_id === session.emotion_tag);
        setEmotionLabel(emotion?.label || session.emotion_tag);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [session.emotion_tag]);

  const handleNext = () => {
    updateSession({ raw_text: text });
    navigate('/need');
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        {emotionLabel}について書き出してください
      </h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="文体・長さは自由です"
        className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-400 mb-4"
      />
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="bg-gray-800 text-white px-6 py-2 rounded-full font-medium"
          aria-label="次へ"
        >
          次へ →
        </button>
      </div>
    </div>
  );
}
