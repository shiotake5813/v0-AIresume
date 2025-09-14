import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Client-side Supabase client (singleton pattern)
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key')
  }
  return supabaseClient
}

// Server-side Supabase client
export function createServerClient() {
  return createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key')
}

// Type definitions
export interface Document {
  id: string
  title: string
  type: 'resume' | 'career'
  content: any
  created_at: string
  updated_at: string
}

// Database operations
export async function getAllDocuments(): Promise<Document[]> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('Error fetching documents:', error)
    throw error
  }
}

export async function getDocumentById(id: string): Promise<Document | null> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Document not found
      }
      throw new Error(`Database error: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Error fetching document:', error)
    throw error
  }
}

export async function saveDocument(document: Omit<Document, 'id' | 'created_at' | 'updated_at'>): Promise<Document> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .insert([document])
      .select()
      .single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Error saving document:', error)
    throw error
  }
}

export async function updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Error updating document:', error)
    throw error
  }
}

export async function deleteDocument(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }
  } catch (error) {
    console.error('Error deleting document:', error)
    throw error
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('count')
      .limit(1)

    return !error
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}
