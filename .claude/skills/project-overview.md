---
name: project-overview
description: Rifuremu プロジェクトの概要
---

# Rifuremu プロジェクト概要

## 概要
プロスペクト理論の損失回避バイアスを、PCT（知覚制御理論）とMOL（Method of Levels）のフレームワークで相殺するトレーニングWebアプリのPoC版です。

## 技術スタック
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router（HashRouter）
- GitHub Pages

## ディレクトリ構造
```
src/
  components/   # 画面コンポーネント（7画面）
  types/        # 型定義
public/
  tag_tree.json # タグマッピングデータ
```

## 重要な制約
- **データ保存なし**：入力内容は一切保存されない。ページリロードでリセットされる。
- **Kimi Code CLI のみがコーディングを行う**：他のAIは閲覧・レビューのみ。
