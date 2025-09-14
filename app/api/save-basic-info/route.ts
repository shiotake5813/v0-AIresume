import { type NextRequest, NextResponse } from "next/server"
import { readBasicInfoLogs, writeBasicInfoLogs } from "@/lib/storage"

// Node.js ランタイムを明示的に指定
export const runtime = "nodejs"

interface BasicInfoLog {
  id: string
  name: string
  furigana?: string
  age: string
  gender?: string
  phone: string
  email?: string
  address: string
  postalCode?: string
  birthDate?: string
  timestamp: string
  ip?: string
  userAgent?: string
}

export async function POST(request: NextRequest) {
  try {
    console.log("基本情報保存API開始")

    // リクエストボディの解析
    const body = await request.json()
    console.log("受信データ:", body)

    const { name, furigana, age, gender, phone, email, address, postalCode, birthDate } = body

    // 必須フィールドのチェック
    if (!name || !phone || !address) {
      console.log("必須フィールドエラー")
      return NextResponse.json(
        {
          success: false,
          message: "必須項目が不足しています（名前、電話番号、住所）",
        },
        { status: 400 },
      )
    }

    // 新しい基本情報ログエントリを作成
    const newBasicInfo: BasicInfoLog = {
      id: `basic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: String(name).trim(),
      furigana: furigana ? String(furigana).trim() : undefined,
      age: age ? String(age).trim() : "",
      gender: gender ? String(gender).trim() : undefined,
      phone: String(phone).trim(),
      email: email ? String(email).trim() : undefined,
      address: String(address).trim(),
      postalCode: postalCode ? String(postalCode).trim() : undefined,
      birthDate: birthDate ? String(birthDate).trim() : undefined,
      timestamp: new Date().toISOString(),
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    }

    console.log("新しいログエントリ:", newBasicInfo)

    // 既存のログを読み込み
    const logs = await readBasicInfoLogs()

    // 新しいログを配列の先頭に追加
    logs.unshift(newBasicInfo)

    // 最大1000件まで保持
    if (logs.length > 1000) {
      logs.splice(1000)
    }

    // ファイルに保存
    await writeBasicInfoLogs(logs)
    console.log("ファイル保存完了")

    return NextResponse.json({
      success: true,
      message: "基本情報が正常に保存されました",
      logId: newBasicInfo.id,
    })
  } catch (error: any) {
    console.error("基本情報保存エラー:", error)

    return NextResponse.json(
      {
        success: false,
        message: "保存中にエラーが発生しました",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
