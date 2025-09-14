// Server-side only database operations
// This file should only be used in server components and API routes
// JSONファイルベースの保存を使用しているため、このファイルは参考用です

export interface Document {
  id: string
  title: string
  type: "resume" | "career"
  content: any
  created_at: string
  updated_at: string
}

export interface BasicInfoLog {
  id: string
  name: string
  phone: string
  email: string
  age: string
  address: string
  documentType: string
  timestamp: string
  ipAddress: string
  userAgent: string
}

// JSONファイルベースの保存を使用しているため、以下の関数は使用されません
// 参考用として残しています

export async function checkSupabaseConnection(): Promise<{ connected: boolean; error?: string; needsSetup?: boolean }> {
  return {
    connected: false,
    error: "JSONファイルベースの保存を使用しています。Supabaseは不要です。",
    needsSetup: false,
  }
}

export async function getUserDocuments(): Promise<Document[]> {
  console.warn("JSONファイルベースの保存を使用しています。この関数は使用されません。")
  return []
}

export async function saveDocument(
  document: Omit<Document, "id" | "created_at" | "updated_at">,
): Promise<Document | null> {
  console.warn("JSONファイルベースの保存を使用しています。この関数は使用されません。")
  return null
}

export async function updateDocument(id: string, updates: Partial<Document>): Promise<Document | null> {
  console.warn("JSONファイルベースの保存を使用しています。この関数は使用されません。")
  return null
}

export async function deleteDocument(id: string): Promise<boolean> {
  console.warn("JSONファイルベースの保存を使用しています。この関数は使用されません。")
  return false
}

export async function getDocument(id: string): Promise<Document | null> {
  console.warn("JSONファイルベースの保存を使用しています。この関数は使用されません。")
  return null
}
