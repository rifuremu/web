# Rifuremu (PoC)

プロスペクト理論の損失回避バイアスを、PCT（知覚制御理論）とMOL（Method of Levels）のフレームワークで相殺するトレーニングWebアプリのPoC版です。

**⚠️ 注意**: このアプリは入力した内容を一切保存しません。ページをリロードするとすべてのデータが失われます。

## 技術スタック

- **フレームワーク**: React 19 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **ルーティング**: React Router（HashRouter）
- **ホスティング**: GitHub Pages

## ディレクトリ構造

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions自動デプロイ
├── public/
│   └── tag_tree.json           # タグマッピングJSON
├── src/
│   ├── components/             # 画面コンポーネント
│   ├── types/                  # 型定義
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## デプロイ

`main` ブランチへの push 時に、GitHub Actions によって GitHub Pages へ自動デプロイされます。

## 画面フロー

1. **Home** — セッション開始
2. **EmotionSelect** — 感情選択
3. **Writing** — 筆記開示
4. **NeedSelect** — 欲求選択
5. **ConceptSelect** — システムコンセプト選択
6. **Summary** — MOL到達サマリー
7. **Reconstruct** — 制御再構成（ゴール感情選択）
8. **Complete** — 完了画面
