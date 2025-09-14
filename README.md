# 履歴書・職務経歴書作成サービス

Google Gemini AIを活用した履歴書・職務経歴書作成サービスです。

## 機能

- 📝 履歴書作成（7ステップ）
- 💼 職務経歴書作成（6ステップ）
- 🤖 Google Gemini AIによる自動生成
- 💾 Supabaseによるデータ保存
- 📱 レスポンシブデザイン
- 🎨 shadcn/ui コンポーネント

## セットアップ

### 1. 依存関係のインストール

\`\`\`bash
npm install
\`\`\`

### 2. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API
GOOGLE_GENERATIVE_AI_API_KEY=your_google_gemini_api_key
\`\`\`

### 3. Supabaseテーブルの作成

Supabase SQL Editorで`scripts/create-tables.sql`を実行してください。

### 4. 開発サーバーの起動

\`\`\`bash
npm run dev
\`\`\`

## API設定

### Google Gemini API

1. [Google AI Studio](https://makersuite.google.com/app/apikey)でAPIキーを取得
2. `.env.local`に`GOOGLE_GENERATIVE_AI_API_KEY`を設定

### Supabase

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. プロジェクトURLとAnon Keyを`.env.local`に設定
3. `scripts/create-tables.sql`を実行してテーブルを作成

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: shadcn/ui
- **AI**: Google Gemini API (@ai-sdk/google)
- **データベース**: Supabase
- **アイコン**: Lucide React

## プロジェクト構造

\`\`\`
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── create-steps/      # 作成ステップページ
│   ├── dashboard/         # ダッシュボード
│   └── page.tsx          # ホームページ
├── components/            # 共通コンポーネント
├── lib/                  # ユーティリティ
├── scripts/              # SQLスクリプト
└── public/               # 静的ファイル
\`\`\`

## 使用方法

1. ホームページから「履歴書作成」または「職務経歴書作成」を選択
2. 7ステップ（履歴書）または6ステップ（職務経歴書）で情報を入力
3. AIによる自動生成機能を活用
4. 完成した書類をプレビュー・保存・ダウンロード

## ライセンス

MIT License
