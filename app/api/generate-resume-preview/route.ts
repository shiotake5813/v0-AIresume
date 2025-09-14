import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

export async function POST(request: NextRequest) {
  try {
    const { formData } = await request.json()

    if (!formData) {
      return NextResponse.json({
        success: false,
        error: 'フォームデータが必要です'
      }, { status: 400 })
    }

    // Check if Google Gemini API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.warn('Google Gemini API key not configured, using fallback')
      return NextResponse.json({
        success: true,
        preview: generateFallbackResumePreview(formData),
        isAiGenerated: false,
        message: 'Google Gemini APIキーが設定されていないため、テンプレートプレビューを使用しています。'
      })
    }

    const basicInfo = formData.step2 || {}
    const educations = formData.step3?.educations || []
    const workHistories = formData.step3?.workHistories || []
    const licenses = formData.step4?.licenses || []

    const prompt = `以下の履歴書情報を基に、履歴書のプレビューを作成してください。

基本情報:
- 氏名: ${basicInfo.name || '未入力'}
- 年齢: ${basicInfo.age || '未入力'}歳
- 性別: ${basicInfo.gender || '未入力'}
- 住所: ${basicInfo.address || '未入力'}
- 電話番号: ${basicInfo.phone || '未入力'}
- メールアドレス: ${basicInfo.email || '未入力'}

学歴:
${educations.map((edu: any) => `- ${edu.date}: ${edu.content}`).join('\n') || '学歴情報なし'}

職歴:
${workHistories.map((work: any) => `- ${work.date}: ${work.content}`).join('\n') || '職歴情報なし'}

免許・資格:
${licenses.map((license: any) => `- ${license.date}: ${license.content}`).join('\n') || '資格情報なし'}

要件:
- 日本の履歴書の標準的な形式で作成
- 基本情報、学歴、職歴、免許・資格を含める
- 読みやすく整理された形式にする
- 日本語で作成する`

    try {
      const { text } = await generateText({
        model: google('gemini-pro'),
        prompt,
        maxTokens: 800,
        temperature: 0.7,
      })

      return NextResponse.json({
        success: true,
        preview: text.trim(),
        isAiGenerated: true,
        message: 'Google Geminiによるプレビュー生成が完了しました。'
      })

    } catch (aiError: any) {
      console.error('AI generation failed:', aiError)
      
      return NextResponse.json({
        success: true,
        preview: generateFallbackResumePreview(formData),
        isAiGenerated: false,
        message: 'AI生成に失敗したため、テンプレートプレビューを使用しています。'
      })
    }

  } catch (error: any) {
    console.error('Error in generate-resume-preview API:', error)
    return NextResponse.json({
      success: false,
      error: 'プレビュー生成中にエラーが発生しました',
      details: error.message
    }, { status: 500 })
  }
}

function generateFallbackResumePreview(formData: any): string {
  const basicInfo = formData.step2 || {}
  const educations = formData.step3?.educations || []
  const workHistories = formData.step3?.workHistories || []
  const licenses = formData.step4?.licenses || []

  let preview = `履歴書

■ 基本情報
氏名: ${basicInfo.name || '未入力'}
年齢: ${basicInfo.age || '未入力'}歳
性別: ${basicInfo.gender || '未入力'}
住所: ${basicInfo.address || '未入力'}
電話番号: ${basicInfo.phone || '未入力'}
メールアドレス: ${basicInfo.email || '未入力'}

■ 学歴
`

  if (educations.length > 0) {
    educations.forEach((edu: any) => {
      preview += `${edu.date} ${edu.content}\n`
    })
  } else {
    preview += `学歴情報が入力されていません。\n`
  }

  preview += `
■ 職歴
`

  if (workHistories.length > 0) {
    workHistories.forEach((work: any) => {
      preview += `${work.date} ${work.content}\n`
    })
  } else {
    preview += `職歴情報が入力されていません。\n`
  }

  preview += `
■ 免許・資格
`

  if (licenses.length > 0) {
    licenses.forEach((license: any) => {
      preview += `${license.date} ${license.content}\n`
    })
  } else {
    preview += `免許・資格情報が入力されていません。\n`
  }

  return preview
}
