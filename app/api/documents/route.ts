import { NextRequest, NextResponse } from 'next/server'
import { getAllDocuments, saveDocument, testConnection } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Test connection first
    const isConnected = await testConnection()
    if (!isConnected) {
      return NextResponse.json({
        success: false,
        error: 'データベース接続に失敗しました',
        documents: []
      }, { status: 500 })
    }

    const documents = await getAllDocuments()
    
    return NextResponse.json({
      success: true,
      documents,
      message: `${documents.length}件のドキュメントを取得しました`
    })
  } catch (error: any) {
    console.error('Error fetching documents:', error)
    
    return NextResponse.json({
      success: false,
      error: 'ドキュメントの取得に失敗しました',
      details: error.message,
      documents: []
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, type, content } = body

    if (!title || !type || !content) {
      return NextResponse.json({
        success: false,
        error: 'タイトル、タイプ、コンテンツが必要です'
      }, { status: 400 })
    }

    if (!['resume', 'career'].includes(type)) {
      return NextResponse.json({
        success: false,
        error: 'タイプは resume または career である必要があります'
      }, { status: 400 })
    }

    const document = await saveDocument({ title, type, content })
    
    return NextResponse.json({
      success: true,
      document,
      message: 'ドキュメントが正常に保存されました'
    })
  } catch (error: any) {
    console.error('Error saving document:', error)
    
    return NextResponse.json({
      success: false,
      error: 'ドキュメントの保存に失敗しました',
      details: error.message
    }, { status: 500 })
  }
}
