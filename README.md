# プロンプト：Reframe PoC Webアプリ開発（保存なし版）

## 1. プロジェクト概要

プロスペクト理論の損失回避バイアスを、PCT（知覚制御理論）とMOL（Method of Levels）のフレームワークで相殺するトレーニングWebアプリのPoCを作成してください。

- **名称**：Reframe（仮）
- **ホスティング**：GitHub Pages（静的サイト）
- **データ保存**：**サーバーDB不使用。クライアントサイドでも過去データを保存しない**
- **形式**：シングルページアプリケーション（SPA）。画面遷移はReact Router等で管理
- **ターゲット**：Linux Mint 22.3上のブラウザ（Firefox/Chrome）およびAndroidブラウザ

## 2. 必須技術スタック

以下から外れないこと。

- **フレームワーク**：React 18 + TypeScript
- **ビルドツール**：Vite
- **スタイリング**：Tailwind CSS（CDN経由またはnpm）
- **ルーティング**：React Router（HashRouterを使用。GitHub Pages対応のため）
- **デプロイ**：GitHub Pages（gh-pagesブランチ自動デプロイ用GitHub Actions設定を含む）

## 3. ディレクトリ構造

生成後の構造は以下とする。

```
reframe-poc/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions自動デプロイ
├── public/
│   └── tag_tree.json           # タグマッピングJSON（静的アセット）
├── src/
│   ├── components/
│   │   ├── Home.tsx            # ホーム（このセッションのサマリー）
│   │   ├── EmotionSelect.tsx   # 感情選択
│   │   ├── Writing.tsx         # 筆記開示
│   │   ├── NeedSelect.tsx      # 欲求選択
│   │   ├── ConceptSelect.tsx   # システムコンセプト選択
│   │   ├── Summary.tsx         # MOL到達サマリー
│   │   ├── Reconstruct.tsx     # 制御再構成（ゴール感情選択）
│   │   └── Complete.tsx        # 完了画面
│   ├── types/
│   │   └── index.ts            # 型定義
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 4. データモデル（メモリ上のみ）

### 4.1 セッション型定義

```typescript
// src/types/index.ts で実装
// ページリロードで消失するメモリ（React State）管理

interface Session {
  raw_text: string;               // 筆記テキスト
  emotion_tag: string;            // 第1層
  need_tag: string;               // 第2層
  concept_tag: string;            // 第3層
  goal_emotion_tag: string | null;// 第4層（null許容）
  valence: 'positive' | 'negative';
}

interface TagTree {
  // public/tag_tree.json として静的配置
  // 詳細は後述
}
```

### 4.2 状態管理

- React Context または App.tsx の State で1セッション分のみ保持
- 画面間の遷移はState passed（useNavigateのstateまたはContext）で管理
- ページリロードで初期状態に戻る

## 5. タグマッピングJSON構造

`public/tag_tree.json` に以下の構造で配置。

```json
{
  "version": "1.0",
  "emotions": [
    {
      "tag_id": "anger",
      "label": "怒り",
      "valence": "negative",
      "prompt": "怒りを感じているのは、何を守ろうとしているからですか？",
      "children": [
        {
          "tag_id": "approval",
          "label": "承認を守る",
          "prompt": "承認を守るのは、あなたにとって何が根底にありますか？",
          "children": [
            {
              "tag_id": "sc_001",
              "label": "私は認められるべき存在だ",
              "type": "system_concept"
            },
            {
              "tag_id": "sc_002",
              "label": "私は正しくあるべき存在だ",
              "type": "system_concept"
            }
          ]
        },
        {
          "tag_id": "justice",
          "label": "正義を貫く",
          "children": [
            {
              "tag_id": "sc_003",
              "label": "私は正義ある存在だ",
              "type": "system_concept"
            }
          ]
        }
      ]
    },
    {
      "tag_id": "joy",
      "label": "喜び",
      "valence": "positive",
      "prompt": "喜びの奥には、何を大切にしている感覚がありますか？",
      "children": [
        {
          "tag_id": "achievement",
          "label": "達成感",
          "children": [
            {
              "tag_id": "sc_004",
              "label": "私は成長し続ける存在だ",
              "type": "system_concept"
            }
          ]
        }
      ]
    }
  ],
  "goal_emotions": [
    { "tag_id": "refreshing", "label": "清々しさ" },
    { "tag_id": "proud", "label": "誇らしさ" },
    { "tag_id": "happy", "label": "嬉しさ" },
    { "tag_id": "fun", "label": "楽しさ" },
    { "tag_id": "comfortable", "label": "気持ちいい" },
    { "tag_id": "cute", "label": "かわいい" },
    { "tag_id": "cool", "label": "かっこいい" }
  ]
}
```

**必須要件：**
- 感情タグは最低8個（怒り、悲しみ、不安、屈辱、嫉妬、孤独、喜び、清々しさ）
- 各感情は最低2つの欲求に分岐
- 各欲求は最低1つのシステムコンセプトに到達
- 分岐木構造を厳守

## 6. 画面仕様（7画面）

全画面は中央寄せのカード型UI。背景はソリッドカラー（#f3f4f6）。タグは pill 形状のボタン。

### 6.1 Home（ホーム）
- タイトル「Reframe」
- 説明文：「このWebアプリでは、入力した内容は保存されません。気軽に試せるPoC版です。」
- ボタン「[ 新しい感情を記録する ]」→ /emotion

### 6.2 EmotionSelect（感情選択）
- プロンプト：「今、あなたの胸にある感情は？」
- タググリッド（3列）。ネガティブは赤枠、ポジティブは青枠
- 選択後、/writing へ遷移（選択したemotion_tagをstateで保持）

### 6.3 Writing（筆記）
- 上部：プロンプト「（感情名）について書き出してください」
- テキストエリア（placeholder：「文体・長さは自由です」）
- ボタン「[ 次へ → ]」→ /need（raw_textが空でも遷移可）

### 6.4 NeedSelect（欲求選択）
- 上部：反映プロンプト「『（筆記テキスト先頭15文字）』という（感情名）の奥には…」
- tag_tree.jsonから該当emotionのchildrenを動的取得
- タグリスト（縦並び pillボタン）
- 選択後 /concept へ

### 6.5 ConceptSelect（システムコンセプト）
- 上部：反映プロンプト「（欲求名）の根底には…」
- tag_tree.jsonから該当needのchildrenを動的取得
- 選択後 /summary へ

### 6.6 Summary（MOL到達サマリー）
- 到達結果を縦に表示：
  - 筆記：「（raw_text）」
  - 欲求：（need_tagのlabel）
  - 根底：（concept_tagのlabel）
- 本文：「この（感情名）は、あなたの『（concept）』というシステムコンセプトを守ろうとしている制御です。」
- ボタン「[ 制御を再構成する → ]」→ /reconstruct
- ※ポジティブ感情の場合はこの画面で「終了」にしても可

### 6.7 Reconstruct（制御再構成）
- 上部：「『（concept）』を大切にするあなたが、最終的に感じたい状態は何ですか？」
- タググリッド：清々しさ、誇らしさ、嬉しさ、楽しさ、気持ちいい、かわいい、かっこいい
- 追加ボタン：「そのままの感情を大切にする」「まだわからない」
- 選択後 /complete へ

### 6.8 Complete（完了）
- 新しい制御経路を縦に表示（感情→欲求→コンセプト→到達：ゴール感情）
- メッセージ：「この経路を確認しました。」
- ボタン「[ ホームへ ]」→ /

## 7. 実装フェーズ

以下の順序で1ファイルずつ生成・編集を行うこと。全てを一気に生成しないこと。

### Phase 1：プロジェクトセットアップ
1. `npm create vite@latest reframe-poc -- --template react-ts`
2. `cd reframe-poc && npm install`
3. `npm install react-router-dom`
4. Tailwind CSSセットアップ（Vite用）
5. `vite.config.ts` に `base: '/reframe-poc/'` を設定（GitHub Pages用）

### Phase 2：基盤
1. `src/types/index.ts`（Session型、TagTree型）
2. `public/tag_tree.json`（上記JSON構造で最低限のタグを網羅）

### Phase 3：画面実装（1画面ずつ）
1. `App.tsx`（HashRouter設定、7画面のルート定義 + ContextでのState管理）
2. `Home.tsx`
3. `EmotionSelect.tsx`
4. `Writing.tsx`
5. `NeedSelect.tsx`
6. `ConceptSelect.tsx`
7. `Summary.tsx`
8. `Reconstruct.tsx`
9. `Complete.tsx`

### Phase 4：デプロイ設定
1. `.github/workflows/deploy.yml`（mainブランチpush時にGitHub Pagesへデプロイ）
2. `README.md`（セットアップ手順、ローカル実行手順）

## 8. デザイン制約

- **テキスト不使用の美学は適用しない**（情報設計アプリのため文字は必須）
- ただし**実写不使用・フラットデザイン**を維持
- 背景：#f3f4f6、カード：#ffffff、シャドウなしまたは極薄（`shadow-sm`）
- タグボタン：pill形状（`rounded-full px-4 py-2`）、選択時は塗りつぶし、未選択時は枠線のみ
- ネガティブ系：赤系（`bg-red-100 text-red-800`）、ポジティブ系：青系（`bg-blue-100 text-blue-800`）
- ゴール感情：緑系（`bg-emerald-100 text-emerald-800`）
- フォント：sans-serif（Tailwindデフォルト）

## 9. 動作確認要件

実装完了後、以下のユーザーフローがエラーなく通ることを確認。

1. ホーム → 「新しい感情を記録」 → 「怒り」選択
2. 「許せないやつが居る」と筆記 → 次へ
3. 「承認を守る」選択 → 次へ
4. 「私は正しくあるべき存在だ」選択 → 次へ
5. サマリー確認 → 「制御を再構成」
6. 「清々しさ」選択
7. 完了画面 → ホームへ
8. 再度ホームから新しい感情を記録 → 以前のデータが残っていないことを確認

## 10. 補足

- エラーハンドリング：tag_tree.jsonのfetch失敗時はconsole.error＋アラート表示
- レスポンシブ：スマホ幅（375px〜）を基準に設計。PCでも中央カードで表示
- アニメーション：不要。即座に遷移
- アクセシビリティ：button要素にaria-labelを付与
- **データ永続化なしのため、ページリロードですべての入力がリセットされます**

---

上記仕様に従い、Phaseごとに実装を進めてください。
まずPhase 1のプロジェクトセットアップから開始してください。
