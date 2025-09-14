import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const USER_DATA_FILE = path.join(DATA_DIR, "user-data-logs.json")

interface UserDataLog {
  id: string
  documentType: "resume" | "career"
  userData: {
    step1?: any
    step2?: any
    step3?: any
    step4?: any
    step5?: any
    step6?: any
    step7?: any
    generatedContent?: string
  }
  metadata: {
    timestamp: string
    ip?: string
    userAgent?: string
    sessionId?: string
    completionStatus: "partial" | "complete"
    lastUpdatedStep: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { documentType, userData, sessionId, completionStatus, lastUpdatedStep } = body

    // データディレクトリが存在しない場合は作成
    try {
      await fs.access(DATA_DIR)
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true })
    }

    // 新しいユーザーデータログエントリを作成
    const newUserLog: UserDataLog = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      documentType: documentType || "resume",
      userData: userData,
      metadata: {
        timestamp: new Date().toISOString(),
        ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
        sessionId: sessionId || `session_${Date.now()}`,
        completionStatus: completionStatus || "partial",
        lastUpdatedStep: lastUpdatedStep || 1,
      },
    }

    // 既存のログを読み込み
    let logs: UserDataLog[] = []
    try {
      const fileContent = await fs.readFile(USER_DATA_FILE, "utf-8")
      logs = JSON.parse(fileContent)
    } catch (error) {
      // ファイルが存在しない場合は空の配列で開始
      logs = []
    }

    // 同じセッションIDの既存データがあるかチェック
    const existingLogIndex = logs.findIndex((log) => log.metadata.sessionId === newUserLog.metadata.sessionId)

    if (existingLogIndex !== -1) {
      // 既存データを更新
      logs[existingLogIndex] = {
        ...logs[existingLogIndex],
        userData: { ...logs[existingLogIndex].userData, ...userData },
        metadata: {
          ...logs[existingLogIndex].metadata,
          timestamp: new Date().toISOString(),
          completionStatus: completionStatus || logs[existingLogIndex].metadata.completionStatus,
          lastUpdatedStep: lastUpdatedStep || logs[existingLogIndex].metadata.lastUpdatedStep,
        },
      }
    } else {
      // 新しいログを追加
      logs.unshift(newUserLog)
    }

    // 最大2000件まで保持（古いログは削除）
    if (logs.length > 2000) {
      logs = logs.slice(0, 2000)
    }

    // ファイルに保存
    await fs.writeFile(USER_DATA_FILE, JSON.stringify(logs, null, 2), "utf-8")

    return NextResponse.json({
      success: true,
      message: "ユーザーデータが正常に保存されました",
      logId: newUserLog.id,
      sessionId: newUserLog.metadata.sessionId,
    })
  } catch (error: any) {
    console.error("ユーザーデータ保存エラー:", error)

    return NextResponse.json({
      success: false,
      message: "保存中にエラーが発生しました",
      error: error.message,
    })
  }
}
