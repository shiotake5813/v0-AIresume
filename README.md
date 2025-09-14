# 履歴書作成サービス

Google Gemini AIを活用した日本の履歴書作成サービスです。7つのステップで簡単に履歴書を作成でき、利用者の基本情報を自動保存します。

## 機能

- 📝 履歴書作成（7ステップ）
- 🤖 Google Gemini AIによる自動生成
- 💾 基本情報の自動保存（JSON形式）
- 👨‍💼 管理画面での利用者情報管理
- 📱 レスポンシブデザイン
- 🎨 shadcn/ui コンポーネント
- 🌐 本番環境対応（Vercel等）

## セットアップ

### 1. 依存関係のインストール

\`\`\`bash
npm install
\`\`\`

### 2. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

\`\`\`env
# Google Gemini API
GOOGLE_GENERATIVE_AI_API_KEY=your_google_gemini_api_key
\`\`\`

### 3. 開発サーバーの起動

\`\`\`bash
npm run dev
\`\`\`

## API設定

### Google Gemini API

1. [Google AI Studio](https://makersuite.google.com/app/apikey)でAPIキーを取得
2. `.env.local`に`GOOGLE_GENERATIVE_AI_API_KEY`を設定

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: shadcn/ui
- **AI**: Google Gemini API (@google/generative-ai)
- **データ保存**: JSON ファイル（ローカル/tmp）
- **アイコン**: Lucide React
- **ランタイム**: Node.js

## プロジェクト構造

\`\`\`
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── save-basic-info/      # 基本情報保存API
│   │   ├── admin/               # 管理画面API
│   │   ├── generate-full-resume/ # 履歴書生成API
│   │   └── generate-text/       # テキスト生成API
│   ├── create-steps/      # 履歴書作成ステップページ
│   │   ├── 1/            # 基本情報
│   │   ├── 2/            # 学歴
│   │   ├── 3/            # 職歴
│   │   ├── 4/            # 資格・免許
│   │   ├── 5/            # 志望動機
│   │   ├── 6/            # 自己PR
│   │   └── 7/            # 確認・生成
│   ├── admin/             # 管理画面
│   ├── result-resume/     # 履歴書結果表示
│   └── page.tsx          # ホームページ
├── components/            # 共通コンポーネント
├── lib/                  # ユーティリティ
│   └── storage.ts        # ファイル保存ヘルパー
└── public/               # 静的ファイル
\`\`\`

## 使用方法

### 履歴書作成

1. ホームページから「履歴書を作成する」をクリック
2. 7つのステップで情報を入力：
   - ステップ1: 基本情報（氏名、住所、電話番号等）
   - ステップ2: 学歴
   - ステップ3: 職歴
   - ステップ4: 資格・免許
   - ステップ5: 志望動機
   - ステップ6: 自己PR
   - ステップ7: 確認・AI生成
3. AIによる履歴書生成
4. 結果の確認・保存・ダウンロード

### 管理画面

1. `/admin`にアクセス
2. パスワード「admin2024」でログイン
3. 利用者の基本情報を確認・管理
4. CSVエクスポート機能
5. 個別データの削除機能

## データ保存

### 基本情報の自動保存

- 履歴書作成の最初のステップで基本情報を自動保存
- 保存先：
  - **本番環境**: `/tmp/basic-info-logs.json`
  - **開発環境**: `process.cwd()/data/basic-info-logs.json`
- 最大1000件まで保存（古いデータは自動削除）

### 保存される情報

\`\`\`json
{
  "id": "unique-session-id",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "name": "山田太郎",
  "furigana": "ヤマダタロウ",
  "phone": "090-1234-5678",
  "email": "yamada@example.com",
  "postalCode": "123-4567",
  "address": "東京都渋谷区...",
  "birthDate": "1990-01-01",
  "gender": "男性"
}
\`\`\`

## デプロイ

### Vercel

1. GitHubリポジトリをVercelに接続
2. 環境変数`GOOGLE_GENERATIVE_AI_API_KEY`を設定
3. デプロイ実行

### その他のプラットフォーム

- Node.js環境が必要
- ファイルシステムへの書き込み権限が必要
- 環境変数の設定が必要

## セキュリティ

- 管理画面はパスワード認証
- APIキーは環境変数で管理
- 個人情報は暗号化なしで保存（開発用途）
- 本番環境では適切なセキュリティ対策を実装してください

## ライセンス

MIT License

## 開発者向け情報

### API エンドポイント

- `POST /api/save-basic-info` - 基本情報保存
- `GET /api/admin/basic-info-logs` - 基本情報一覧取得
- `DELETE /api/admin/basic-info-logs/[id]` - 基本情報削除
- `POST /api/generate-full-resume` - 履歴書生成
- `POST /api/generate-text` - テキスト生成

### 環境変数

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API キー | ✅ |

### トラブルシューティング

#### 500エラーが発生する場合

1. 環境変数が正しく設定されているか確認
2. ファイルシステムの書き込み権限を確認
3. Node.jsランタイムが使用されているか確認

#### データが保存されない場合

1. `/tmp`ディレクトリ（本番）または`data`ディレクトリ（開発）の権限を確認
2. APIエンドポイントが正しく動作しているか確認
3. ブラウザの開発者ツールでネットワークエラーを確認

## 更新履歴

- v1.0.0: 初回リリース（履歴書作成機能のみ）
- 職務経歴書機能を削除し、履歴書作成に特化
- 本番環境対応（read-only filesystem対策）
- 管理画面での基本情報管理機能追加
