import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

export async function POST(request: NextRequest) {
  try {
    const { prompt, type, context } = await request.json()

    if (!prompt) {
      return NextResponse.json({
        success: false,
        error: 'Prompt is required'
      }, { status: 400 })
    }

    // Check if Google AI API key is available
    const hasGoogleAI = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY

    let generatedText = ''
    let isAIGenerated = false

    if (hasGoogleAI) {
      try {
        const result = await generateText({
          model: google('gemini-pro'),
          prompt: prompt,
          maxTokens: 500,
        })

        generatedText = result.text
        isAIGenerated = true

      } catch (aiError: any) {
        console.error('Google AI generation failed:', aiError)
        
        // Check for specific error types
        if (aiError.message?.includes('API key') || aiError.message?.includes('authentication')) {
          return NextResponse.json({
            success: false,
            error: 'Google AI APIキーが無効です。設定を確認してください。',
            details: aiError.message,
            needsSetup: true
          }, { status: 401 })
        }
        
        if (aiError.message?.includes('quota') || aiError.message?.includes('limit')) {
          return NextResponse.json({
            success: false,
            error: 'API使用量の上限に達しました。しばらく時間をおいてから再試行してください。',
            details: aiError.message,
            needsSetup: false
          }, { status: 429 })
        }

        // Fall back to template-based generation
        isAIGenerated = false
      }
    }

    // Fallback generation if AI is not available or failed
    if (!isAIGenerated) {
      generatedText = generateFallbackText(type, context)
    }

    return NextResponse.json({
      success: true,
      text: generatedText,
      isAIGenerated,
      message: isAIGenerated 
        ? 'AI生成が完了しました' 
        : 'テンプレートベースで生成しました（AI APIが利用できません）'
    })

  } catch (error: any) {
    console.error('Text generation error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'テキスト生成中にエラーが発生しました',
      details: error.message
    }, { status: 500 })
  }
}

function generateFallbackText(type: string, context: any): string {
  switch (type) {
    case 'selfPR':
      return `私は責任感が強く、チームワークを大切にする人間です。これまでの経験を通じて培った${context?.skills || 'コミュニケーション能力'}を活かし、貴社の発展に貢献したいと考えております。常に向上心を持ち、新しいことに挑戦する姿勢を大切にしています。`
      
    case 'motivation':
      return `貴社を志望する理由は、${context?.company || '御社'}の事業内容に強い関心を持ち、自分の経験とスキルを活かして貢献できると考えているためです。入社後は、チームの一員として責任を持って業務に取り組み、会社の目標達成に向けて努力してまいります。`
      
    case 'jobSummary':
      return `これまでの職務経験を通じて、${context?.field || '様々な分野'}での実務能力を身につけました。特に${context?.strength || 'プロジェクト管理'}において成果を上げ、チームの目標達成に貢献してきました。今後もこれらの経験を活かし、さらなる成長を目指します。`
      
    default:
      return 'テンプレートベースの文章が生成されました。内容を確認し、必要に応じて編集してください。'
  }
}
