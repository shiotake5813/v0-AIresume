import { type NextRequest, NextResponse } from "next/server"
import { readBasicInfoLogs, writeBasicInfoLogs } from "@/lib/storage"

// Node.js ランタイムを明示的に指定
export const runtime = "nodejs"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { id } = params

    // ログを読み込み
    const logs = await readBasicInfoLogs()

    // 指定されたIDのログを削除
    const filteredLogs = logs.filter((log) => log.id !== id)

    if (logs.length === filteredLogs.length) {
      return NextResponse.json(
        {
          success: false,
          message: "指定されたログが見つかりません",
        },
        { status: 404 },
      )
    }

    // 更新されたログを保存
    await writeBasicInfoLogs(filteredLogs)

    return NextResponse.json({
      success: true,
      message: "ログが削除されました",
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
