import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyAW0b16t08GRu3hA0vgzXPfrgdyDMmzR3E")

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      personalInfo,
      education,
      work,
      licenses,
      motivation,
      selfPR,
      specialSkills,
      hobbies,
      qualifications,
      additionalInfo,
      workPreferences,
      salaryExpectation,
      workLocation,
      startDate,
      workingHours,
      otherRequests,
    } = body

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // 学歴情報を整理
    const educationText =
      education
        ?.map((edu: any) => `${edu.year}年${edu.month}月 ${edu.school} ${edu.department} ${edu.status}`)
        .join("\n") || "学歴情報なし"

    // 職歴情報を整理
    const workText =
      work
        ?.map((work: any) => `${work.year}年${work.month}月 ${work.company} ${work.position} ${work.status}`)
        .join("\n") || "職歴情報なし"

    // 免許・資格情報を整理
    const licensesText =
      licenses?.map((license: any) => `${license.year}年${license.month}月 ${license.name}`).join("\n") ||
      "免許・資格情報なし"

    // 詳細技能情報を整理
    const qualificationsText =
      qualifications?.map((qual: any) => `${qual.name} (レベル: ${qual.level}) - ${qual.description}`).join("\n") ||
      "詳細技能情報なし"

    const prompt = `
以下の情報を基に、日本工業規格(JIS)準拠の履歴書フォーマットに従って、プロフェッショナルで魅力的な履歴書を作成してください。

【基本情報】
ふりがな: ${personalInfo?.furigana || "未入力"}
氏名: ${personalInfo?.name || "未入力"}
生年月日: ${personalInfo?.birthDate || "未入力"}
年齢: ${personalInfo?.age || "未入力"}歳
性別: ${personalInfo?.gender || "未入力"}
郵便番号: ${personalInfo?.postalCode || "未入力"}
住所: ${personalInfo?.address || "未入力"}
電話番号: ${personalInfo?.phone || "未入力"}
メールアドレス: ${personalInfo?.email || "未入力"}

【学歴】
${educationText}

【職歴】
${workText}

【免許・資格】
${licensesText}

【志望動機】
${motivation || "未入力"}

【自己PR】
${selfPR || "未入力"}

【特技】
${specialSkills || "未入力"}

【趣味】
${hobbies || "未入力"}

【詳細技能・資格】
${qualificationsText}

【補足情報】
${additionalInfo || "未入力"}

【希望条件】
希望職種・業務内容: ${workPreferences || "未入力"}
希望給与: ${salaryExpectation || "未入力"}
勤務地希望: ${workLocation || "未入力"}
入社可能日: ${startDate || "未入力"}
勤務時間希望: ${workingHours || "未入力"}
その他の要望: ${otherRequests || "未入力"}

【作成指示】
1. 日本工業規格(JIS)準拠の履歴書フォーマットに従って整理してください
2. 採用担当者に好印象を与える内容にしてください
3. 具体的で説得力のある表現を使用してください
4. 不足している情報がある場合は、入力された情報から推測して適切に補完してください
5. 学歴・職歴は時系列順に整理してください
6. 志望動機と自己PRは特に魅力的に仕上げてください
7. 本人希望記入欄には待遇・職種・勤務時間・勤務地・その他の希望を含めてください
8. 全体的に一貫性のある内容にしてください

出力は以下のJIS準拠履歴書形式で整理してください：

履歴書

【基本情報】
ふりがな: [ふりがな]
氏名: [氏名]
生年月日: [年]年[月]月[日]日生 (満[年齢]歳)
現住所: 〒[郵便番号] [住所]
電話: [電話番号]
E-mail: [メールアドレス]

【学歴・職歴】
[年] [月] [学歴・職歴を時系列順に記載]
...
以上

【免許・資格】
[年] [月] [免許・資格名]
...

【本人希望記入欄】
【志望動機】
[魅力的に再構成された志望動機]

【自己PR】
[強みを明確に表現した自己PR]

【希望条件】
・希望職種: [希望職種]
・希望給与: [希望給与]
・勤務地: [希望勤務地]
・勤務時間: [希望勤務時間]
・その他: [その他の要望]
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      success: true,
      resume: text,
    })
  } catch (error: any) {
    console.error("履歴書生成エラー:", error)

    // フォールバック履歴書を生成
    const { personalInfo, education, work, licenses, motivation, selfPR } = await request.json()

    const fallbackResume = `
履歴書

【基本情報】
ふりがな: ${personalInfo?.furigana || "未入力"}
氏名: ${personalInfo?.name || "未入力"}
生年月日: ${personalInfo?.birthDate || "未入力"}
年齢: ${personalInfo?.age || "未入力"}歳
性別: ${personalInfo?.gender || "未入力"}
現住所: 〒${personalInfo?.postalCode || ""} ${personalInfo?.address || "未入力"}
電話: ${personalInfo?.phone || "未入力"}
E-mail: ${personalInfo?.email || "未入力"}

【学歴・職歴】
${education?.map((edu: any) => `${edu.year}年${edu.month}月 ${edu.school} ${edu.department} ${edu.status}`).join("\n") || "学歴情報を入力してください"}

${work?.map((work: any) => `${work.year}年${work.month}月 ${work.company} ${work.position} ${work.status}`).join("\n") || "職歴情報を入力してください"}
以上

【免許・資格】
${licenses?.map((license: any) => `${license.year}年${license.month}月 ${license.name}`).join("\n") || "免許・資格情報を入力してください"}

【本人希望記入欄】
【志望動機】
${motivation || "志望動機を入力してください"}

【自己PR】
${selfPR || "自己PR情報を入力してください"}

※ AI生成に失敗したため、基本的なテンプレートを表示しています。
`

    return NextResponse.json({
      success: true,
      resume: fallbackResume,
      warning: "AI生成に失敗しましたが、基本的な履歴書を作成しました。",
    })
  }
}
