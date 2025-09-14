import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const USER_DATA_FILE = path.join(DATA_DIR, "user-data-logs.json")

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const password = searchParams.get("password")

    // 簡単なパスワード認証
    if (password !== "admin2024") {
      return NextResponse.json({
        success: false,
        message: "認証に失敗しました",
      })
    }

    try {
      const fileContent = await fs.readFile(USER_DATA_FILE, "utf-8")
      const logs = JSON.parse(fileContent)

      return NextResponse.json({
        success: true,
        logs: logs,
        count: logs.length,
      })
    } catch (error) {
      // ファイルが存在しない場合
      return NextResponse.json({
        success: true,
        logs: [],
        count: 0,
      })
    }
  } catch (error: any) {
    console.error("ユーザーデータログ取得エラー:", error)

    return NextResponse.json({
      success: false,
      message: "ログの取得中にエラーが発生しました",
      error: error.message,
    })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    // 簡単なパスワード認証
    if (password !== "admin2024") {
      return NextResponse.json({
        success: false,
        message: "認証に失敗しました",
      })
    }

    // ファイルを削除（または空にする）
    await fs.writeFile(USER_DATA_FILE, JSON.stringify([], null, 2), "utf-8")

    return NextResponse.json({
      success: true,
      message: "全てのユーザーデータログが削除されました",
    })
  } catch (error: any) {
    console.error("ユーザーデータログ削除エラー:", error)

    return NextResponse.json({
      success: false,
      message: "ログの削除中にエラーが発生しました",
      error: error.message,
    })
  }
}
