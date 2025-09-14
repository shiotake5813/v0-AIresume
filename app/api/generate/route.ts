import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

export async function POST(request: NextRequest) {
  try {
    const { type, formData } = await request.json()

    if (!type || !formData) {
      return NextResponse.json({
        success: false,
        error: 'タイプとフォームデータが必要です'
      }, { status: 400 })
    }

    // Check if Google Gemini API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.warn('Google Gemini API key not configured, using fallback')
      return NextResponse.json({
        success: true,
        text: generateFallbackText(type, formData),
        isAiGenerated: false,
        message: 'Google Gemini APIキーが設定されていないため、テンプレートテキストを使用しています。'
      })
    }

    let prompt = ''
    
    if (type === 'career_summary') {
      const basicInfo = formData.step1 || {}
      const workHistory = formData.step2?.workHistory || []
      const skills = formData.step3?.skills || []

      prompt = `以下の職務経歴書情報を基に、職務要約を300文字程度で作成してください。

基本情報:
- 氏名: ${basicInfo.name || '未入力'}
- 年齢: ${basicInfo.age || '未入力'}歳

職歴:
${workHistory.map((work: any) => `- ${work.period}: ${work.company} ${work.position} (${work.department})`).join('\n') || '職歴情報なし'}

スキル:
${skills.map((skill: any) => `- ${skill.category}: ${skill.items.join(', ')}`).join('\n') || 'スキル情報なし'}

要件:
- 具体的な経験と実績を含める
- 専門性とスキルを強調する
- 簡潔で読みやすい文章にする
- 日本語で作成する`

    } else if (type === 'self_pr') {
      const basicInfo = formData.step1 || {}
      const workHistory = formData.step2?.workHistory || []
      const skills = formData.step3?.skills || []

      prompt = `以下の職務経歴書情報を基に、自己PRを300文字程度で作成してください。

基本情報:
- 氏名: ${basicInfo.name || '未入力'}
- 年齢: ${basicInfo.age || '未入力'}歳

職歴:
${workHistory.map((work: any) => `- ${work.period}: ${work.company} ${work.position} (${work.department})`).join('\n') || '職歴情報なし'}

スキル:
${skills.map((skill: any) => `- ${skill.category}: ${skill.items.join(', ')}`).join('\n') || 'スキル情報なし'}

要件:
- 強みと特徴を明確にする
- 具体的な成果や実績を含める
- 将来への意欲を示す
- 日本語で作成する`

    } else {
      return NextResponse.json({
        success: false,
        error: '無効なリクエストタイプです'
      }, { status: 400 })
    }

    try {
      const { text } = await generateText({
        model: google('gemini-pro'),
        prompt,
        maxTokens: 400,
        temperature: 0.7,
      })

      return NextResponse.json({
        success: true,
        text: text.trim(),
        isAiGenerated: true,
        message: 'Google Geminiによる生成が完了しました。'
      })

    } catch (aiError: any) {
      console.error('AI generation failed:', aiError)
      
      return NextResponse.json({
        success: true,
        text: generateFallbackText(type, formData),
        isAiGenerated: false,
        message: 'AI生成に失敗したため、テンプレートテキストを使用しています。'
      })
    }

  } catch (error: any) {
    console.error('Error in generate API:', error)
    return NextResponse.json({
      success: false,
      error: 'テキスト生成中にエラーが発生しました',
      details: error.message
    }, { status: 500 })
  }
}

function generateFallbackText(type: string, formData: any): string {
  if (type === 'career_summary') {
    const basicInfo = formData.step1 || {}
    const workHistory = formData.step2?.workHistory || []
    const name = basicInfo.name || 'あなた'
    
    let text = `${name}と申します。`
    
    if (workHistory.length > 0) {
      const latestWork = workHistory[workHistory.length - 1]
      text += `${latestWork.company}での${latestWork.position}としての経験を通じて、専門的なスキルと実務経験を積んでまいりました。`
    } else {
      text += `これまでの経験を通じて、専門的なスキルと実務経験を積んでまいりました。`
    }
    
    text += `チームワークを重視し、常に品質向上と効率化を心がけて業務に取り組んでおります。今後も継続的な学習により、さらなるスキルアップを図り、組織の発展に貢献したいと考えております。`
    
    return text
  }
  
  if (type === 'self_pr') {
    const basicInfo = formData.step1 || {}
    const workHistory = formData.step2?.workHistory || []
    const name = basicInfo.name || 'あなた'
    
    let text = `私の強みは、`
    
    if (workHistory.length > 0) {
      text += `これまでの職務経験で培った問題解決能力とコミュニケーション力です。`
    } else {
      text += `学習意欲と適応力の高さです。`
    }
    
    text += `困難な状況でも冷静に対処し、チームメンバーと連携して最適な解決策を見つけることができます。また、新しい技術や手法に対する学習意欲が高く、常に自己研鑽を怠りません。これらの強みを活かし、組織の目標達成に貢献したいと考えております。`
    
    return text
  }
  
  return 'テンプレートテキストです。実際の内容に合わせて編集してください。'
}
