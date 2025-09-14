import { promises as fs } from "fs"
import { existsSync } from "fs"
import path from "path"

/**
 * 環境に応じた適切なデータディレクトリを取得
 * production: /tmp (書き込み可能)
 * それ以外: process.cwd()/data
 */
export function getDataDirectory(): string {
  if (process.env.NODE_ENV === "production") {
    return "/tmp"
  }
  return path.join(process.cwd(), "data")
}

/**
 * 基本情報ログファイルのパスを取得
 */
export function getBasicInfoLogPath(): string {
  return path.join(getDataDirectory(), "basic-info-logs.json")
}

/**
 * データディレクトリが存在しない場合は作成
 */
export async function ensureDataDirectory(): Promise<void> {
  const dataDir = getDataDirectory()
  if (!existsSync(dataDir)) {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

/**
 * 基本情報ログを読み込み
 */
export async function readBasicInfoLogs(): Promise<any[]> {
  const logFile = getBasicInfoLogPath()

  try {
    if (existsSync(logFile)) {
      const fileContent = await fs.readFile(logFile, "utf-8")
      const logs = JSON.parse(fileContent)
      return Array.isArray(logs) ? logs : []
    }
  } catch (error) {
    console.log("既存ログファイル読み込みエラー:", error)
  }

  return []
}

/**
 * 基本情報ログを保存
 */
export async function writeBasicInfoLogs(logs: any[]): Promise<void> {
  await ensureDataDirectory()
  const logFile = getBasicInfoLogPath()
  await fs.writeFile(logFile, JSON.stringify(logs, null, 2), "utf-8")
}
