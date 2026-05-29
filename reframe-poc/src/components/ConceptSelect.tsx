import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../SessionContext';
import type { TagTree, TagTreeNode } from '../types';

export default function ConceptSelect() {
  const navigate = useNavigate();
  const { session, updateSession } = useSession();
  const [concepts, setConcepts] = useState<TagTreeNode[]>([]);
  const [needLabel, setNeedLabel] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}tag_tree.json`)
      .then((res) => res.json())
      .then((data: TagTree) => {
        const emotion = data.emotions.find((e) => e.tag_id === session.emotion_tag);
        const need = emotion?.children?.find((n) => n.tag_id === session.need_tag);
        setNeedLabel(need?.label || '');
        setConcepts(need?.children || []);
      })
      .catch((err) => {
        console.error(err);
        alert('タグデータの読み込みに失敗しました');
      });
  }, [session.emotion_tag, session.need_tag]);

  const handleSelect = (concept: TagTreeNode) => {
    updateSession({ concept_tag: concept.tag_id });
    navigate('/summary');
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        {needLabel}の根底には…
      </p>
      <div className="space-y-3">
        {concepts.map((concept) => (
          <button
            key={concept.tag_id}
            onClick={() => handleSelect(concept)}
            className="w-full rounded-full px-4 py-3 text-sm font-medium border border-gray-300 text-gray-800 hover:bg-gray-100 text-left"
            aria-label={concept.label}
          >
            {concept.label}
          </button>
        ))}
      </div>
    </div>
  );
}
