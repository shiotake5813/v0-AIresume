import { NextRequest, NextResponse } from 'next/server'
import { saveDocument } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { formData, generatedContent } = await request.json()

    if (!formData) {
      return NextResponse.json({
        success: false,
        error: 'フォームデータが必要です'
      }, { status: 400 })
    }

    const document = {
      title: formData.step1?.documentName || '新しい履歴書',
      type: 'resume' as const,
      content: {
        formData,
        generatedContent
      }
    }

    const savedDocument = await saveDocument(document)

    if (!savedDocument) {
      return NextResponse.json({
        success: false,
        error: '履歴書の保存に失敗しました'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      id: savedDocument.id,
      message: '履歴書が正常に保存されました'
    })

  } catch (error: any) {
    console.error('Error in save-resume API:', error)
    return NextResponse.json({
      success: false,
      error: '履歴書の保存中にエラーが発生しました',
      details: error.message
    }, { status: 500 })
  }
}
