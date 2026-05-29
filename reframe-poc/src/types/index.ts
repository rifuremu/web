export interface Session {
  raw_text: string;
  emotion_tag: string;
  need_tag: string;
  concept_tag: string;
  goal_emotion_tag: string | null;
  valence: 'positive' | 'negative';
}

export interface TagTreeNode {
  tag_id: string;
  label: string;
  valence?: 'positive' | 'negative';
  prompt?: string;
  type?: string;
  children?: TagTreeNode[];
}

export interface TagTree {
  version: string;
  emotions: TagTreeNode[];
  goal_emotions: Array<{ tag_id: string; label: string }>;
}
