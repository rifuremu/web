import { useNavigate } from 'react-router-dom';
import { useSession } from '../SessionContext';
import { useState, useEffect } from 'react';
import type { TagTree } from '../types';

export default function Summary() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [labels, setLabels] = useState({
    emotion: '',
    need: '',
    concept: '',
  });

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}tag_tree.json`)
      .then((res) => res.json())
      .then((data: TagTree) => {
        const emotion = data.emotions.find((e) => e.tag_id === session.emotion_tag);
        const need = emotion?.children?.find((n) => n.tag_id === session.need_tag);
        const concept = need?.children?.find((c) => c.tag_id === session.concept_tag);
        setLabels({
          emotion: emotion?.label || session.emotion_tag,
          need: need?.label || session.need_tag,
          concept: concept?.label || session.concept_tag,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [session.emotion_tag, session.need_tag, session.concept_tag]);

  const handleReconstruct = () => {
    navigate('/reconstruct');
  };

  const handleFinish = () => {
    navigate('/');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 text-center">MOL到達サマリー</h2>
      <div className="space-y-2 text-sm text-gray-800">
        <p>筆記：「{session.raw_text}」</p>
        <p>欲求：{labels.need}</p>
        <p>根底：{labels.concept}</p>
      </div>
      <p className="text-sm text-gray-600">
        この{labels.emotion}は、あなたの『{labels.concept}』というシステムコンセプトを守ろうとしている制御です。
      </p>
      <div className="flex flex-col gap-3 pt-2">
        <button
          onClick={handleReconstruct}
          className="bg-gray-800 text-white px-6 py-3 rounded-full font-medium"
          aria-label="制御を再構成する"
        >
          制御を再構成する →
        </button>
        {session.valence === 'positive' && (
          <button
            onClick={handleFinish}
            className="border border-gray-300 text-gray-800 px-6 py-3 rounded-full font-medium"
            aria-label="終了する"
          >
            終了する
          </button>
        )}
      </div>
    </div>
  );
}
