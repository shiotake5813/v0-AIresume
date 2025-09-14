-- このファイルはSupabaseを使用しない場合は不要です
-- JSONファイルベースの保存を使用しています

-- 参考用のSupabaseテーブル定義
-- CREATE TABLE basic_info_logs (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   name TEXT NOT NULL,
--   phone TEXT NOT NULL,
--   email TEXT,
--   age TEXT,
--   address TEXT,
--   document_type TEXT,
--   timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   ip_address TEXT,
--   user_agent TEXT,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- RLS (Row Level Security) を有効にする
-- ALTER TABLE basic_info_logs ENABLE ROW LEVEL SECURITY;

-- 管理者のみアクセス可能なポリシー
-- CREATE POLICY "Admin only access" ON basic_info_logs
--   FOR ALL USING (false);
