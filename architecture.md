# Rifuremu アーキテクチャ

## システム概要
シングルページアプリケーション（SPA）。GitHub Pages でホスティングされる静的サイト。

## フロントエンド構成

### 画面遷移（React Router / HashRouter）
1. `/` Home — セッション開始
2. `/emotion` EmotionSelect — 感情選択
3. `/writing` Writing — 筆記開示
4. `/need` NeedSelect — 欲求選択
5. `/concept` ConceptSelect — システムコンセプト選択
6. `/summary` Summary — MOL到達サマリー
7. `/reconstruct` Reconstruct — 制御再構成
8. `/complete` Complete — 完了画面

### 状態管理
- React Context（`SessionContext`）で1セッション分のみ保持
- ページリロードでリセット

### データフロー
```
EmotionSelect → Writing → NeedSelect → ConceptSelect → Summary → Reconstruct → Complete
     ↑________________________________________________________________________________|
```

### ビルド・デプロイ
- Vite でビルド
- GitHub Actions で `gh-pages` ブランチへ自動デプロイ
- アセットパス：`/web/`

## 外部依存
- `public/tag_tree.json` — 感情タグの階層構造（ビルド時に静的アセットとして配置）
