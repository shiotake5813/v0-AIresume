-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('resume', 'career')),
    content JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_updated_at ON documents(updated_at DESC);

-- Create GIN index for JSONB content (without text operator class)
CREATE INDEX IF NOT EXISTS idx_documents_content_gin ON documents USING gin(content);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations for now" ON documents;

-- Create policy to allow all operations (you can restrict this later)
CREATE POLICY "Allow all operations for now" ON documents
    FOR ALL USING (true);

-- Grant permissions
GRANT ALL ON documents TO anon;
GRANT ALL ON documents TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO documents (title, type, content) VALUES 
(
    'サンプル履歴書',
    'resume',
    '{
        "step1": {"documentName": "サンプル履歴書", "createdDate": "2024-01-15"},
        "step2": {"name": "山田太郎", "furigana": "ヤマダタロウ", "birthDate": "1990-04-15", "gender": "男性", "postalCode": "123-4567", "address": "東京都渋谷区1-2-3", "phone": "090-1234-5678", "email": "yamada@example.com"},
        "step3": {"educations": [{"startYear": "2009", "startMonth": "4", "endYear": "2013", "endMonth": "3", "schoolName": "○○大学", "department": "経済学部", "status": "卒業"}]},
        "step4": {"experiences": [{"startYear": "2013", "startMonth": "4", "endYear": "2023", "endMonth": "12", "companyName": "株式会社○○", "department": "営業部", "position": "営業", "employmentType": "正社員"}]},
        "step5": {"qualifications": [{"year": "2012", "month": "6", "name": "普通自動車第一種運転免許"}], "selfPR": "私は営業職として10年間の経験を積み、顧客との信頼関係構築を得意としています。", "motivation": "貴社の事業内容に強く共感し、これまでの経験を活かして貢献したいと考えています。"}
    }'
),
(
    'サンプル職務経歴書',
    'career',
    '{
        "step1": {"documentName": "サンプル職務経歴書", "createdDate": "2024-01-15"},
        "step2": {"name": "佐藤花子", "furigana": "サトウハナコ", "birthDate": "1985-08-20", "address": "大阪府大阪市北区4-5-6", "phone": "080-9876-5432", "email": "sato@example.com"},
        "companies": [{"name": "株式会社ABC", "period": "2008年4月〜2023年12月", "business": "システム開発", "employees": "500名", "capital": "1億円"}],
        "jobHistories": [{"period": "2008年4月〜2023年12月", "company": "株式会社ABC", "department": "開発部", "position": "システムエンジニア", "employmentType": "正社員", "responsibilities": "Webアプリケーションの設計・開発・保守"}],
        "qualifications": [{"date": "2010年10月", "name": "基本情報技術者試験"}],
        "skills": {"technical": ["Java", "Python", "JavaScript"], "business": ["プロジェクト管理", "要件定義"], "languages": [{"name": "英語", "level": "日常会話レベル"}]},
        "selfPR": "15年間のシステム開発経験を通じて、技術力と問題解決能力を身につけました。",
        "jobSummary": "主にWebアプリケーションの開発に従事し、要件定義から保守まで一貫して担当してきました。"
    }'
);

-- Create additional indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_documents_title ON documents(title);
CREATE INDEX IF NOT EXISTS idx_documents_content_name ON documents USING gin((content->>'name'));
