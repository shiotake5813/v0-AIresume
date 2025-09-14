import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyAW0b16t08GRu3hA0vgzXPfrgdyDMmzR3E")

export async function POST(request: NextRequest) {
  try {
    const { field, personalInfo, education, work, licenses } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // 個人情報を文字列に変換
    const personalInfoText = personalInfo
      ? `
名前: ${personalInfo.name || "未入力"}
年齢: ${personalInfo.age || "未入力"}歳
住所: ${personalInfo.address || "未入力"}
`
      : "個人情報未入力"

    // 学歴を文字列に変換
    const educationText =
      education?.length > 0
        ? education.map((edu: any) => `${edu.year}年 ${edu.school} ${edu.department} ${edu.status}`).join(", ")
        : "学歴情報未入力"

    // 職歴を文字列に変換
    const workText =
      work?.length > 0
        ? work.map((work: any) => `${work.year}年 ${work.company} ${work.position} ${work.status}`).join(", ")
        : "職歴情報未入力"

    // 免許・資格を文字列に変換
    const licensesText =
      licenses?.length > 0
        ? licenses.map((license: any) => `${license.year}年 ${license.name}`).join(", ")
        : "免許・資格情報未入力"

    let prompt = ""

    switch (field) {
      case "motivation":
        prompt = `
以下の個人情報を基に、魅力的な志望動機を200文字程度で作成してください：

【個人情報】
${personalInfoText}

【学歴】
${educationText}

【職歴】
${workText}

【免許・資格】
${licensesText}

ポイント：
- 具体的で説得力のある内容
- 企業への熱意を表現
- 自分の経験や強みをアピール
- 日本の履歴書に適した丁寧な表現
`
        break
      case "selfPR":
        prompt = `
以下の個人情報を基に、効果的な自己PRを200文字程度で作成してください：

【個人情報】
${personalInfoText}

【学歴】
${educationText}

【職歴】
${workText}

【免許・資格】
${licensesText}

ポイント：
- 具体的な経験や実績を含める
- 企業にとってのメリットを明確に
- 個性や強みを際立たせる
- 日本の履歴書に適した謙虚で前向きな表現
`
        break
      case "specialSkills":
        prompt = `
以下の個人情報を基に、特技欄の内容を150文字程度で作成してください：

【個人情報】
${personalInfoText}

【学歴】
${educationText}

【職歴】
${workText}

【免許・資格】
${licensesText}

ポイント：
- 業務に関連するスキルを優先
- 具体的な技能レベルも含める
- 人柄が伝わる内容も含める
- 日本の履歴書に適した表現
`
        break
      case "hobbies":
        prompt = `
以下の個人情報を基に、趣味欄の内容を100文字程度で作成してください：

【個人情報】
${personalInfoText}

ポイント：
- 人柄が伝わる趣味を選択
- 継続性や向上心が感じられる内容
- 面接での話題になりそうな内容
- 日本の履歴書に適した表現
`
        break
      default:
        prompt = `以下の内容を履歴書に適した形式で整理してください：
${personalInfoText}
${educationText}
${workText}
${licensesText}`
    }

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      success: true,
      text: text.trim(),
    })
  } catch (error: any) {
    console.error("テキスト生成エラー:", error)

    // フィールドに応じたフォールバックテキスト
    let fallbackText = ""
    const { field } = await request.json()

    switch (field) {
      case "motivation":
        fallbackText = "貴社の事業内容に強く興味を持ち、これまでの経験を活かして貢献したいと考えております。"
        break
      case "selfPR":
        fallbackText = "責任感が強く、チームワークを大切にして業務に取り組みます。"
        break
      case "specialSkills":
        fallbackText = "コミュニケーション能力、基本的なPC操作"
        break
      case "hobbies":
        fallbackText = "読書、映画鑑賞"
        break
      default:
        fallbackText = "AI生成に失敗しました。手動で入力してください。"
    }

    return NextResponse.json({
      success: false,
      error: "テキスト生成に失敗しました",
      text: fallbackText,
    })
  }
}
