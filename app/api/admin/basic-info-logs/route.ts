import { type NextRequest, NextResponse } from "next/server"
import { readBasicInfoLogs, writeBasicInfoLogs } from "@/lib/storage"

// Node.js ランタイムを明示的に指定
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const password = searchParams.get("password")

    // パスワード認証
    if (password !== "admin2024") {
      return NextResponse.json(
        {
          success: false,
          message: "認証に失敗しました",
        },
        { status: 401 },
      )
    }

    // ログを読み込み
    const logs = await readBasicInfoLogs()

    return NextResponse.json({
      success: true,
      logs: logs,
      total: logs.length,
    })
  } catch (error: any) {
    console.error("ログ取得エラー:", error)

    return NextResponse.json(
      {
        success: false,
        message: "ログの取得に失敗しました",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const password = searchParams.get("password")

    // パスワード認証
    if (password !== "admin2024") {
      return NextResponse.json(
        {
          success: false,
          message: "認証に失敗しました",
        },
        { status: 401 },
      )
    }

    // 全ログを削除（空の配列で上書き）
    await writeBasicInfoLogs([])

    return NextResponse.json({
      success: true,
      message: "全てのログが削除されました",
    })
  } catch (error: any) {
    console.error("ログ削除エラー:", error)

    return NextResponse.json(
      {
        success: false,
        message: "ログの削除に失敗しました",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
