"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Download, Eye, Search, RefreshCw } from "lucide-react"

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

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [logs, setLogs] = useState<BasicInfoLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<BasicInfoLog[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLog, setSelectedLog] = useState<BasicInfoLog | null>(null)

  const authenticate = async () => {
    if (password === "admin2024") {
      setIsAuthenticated(true)
      await fetchLogs()
    } else {
      alert("パスワードが正しくありません")
    }
  }

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/basic-info-logs?password=admin2024`)
      const result = await response.json()

      if (result.success) {
        setLogs(result.logs)
        setFilteredLogs(result.logs)
      } else {
        alert("ログの取得に失敗しました: " + result.message)
      }
    } catch (error) {
      console.error("ログ取得エラー:", error)
      alert("ログの取得に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const deleteLog = async (id: string) => {
    if (!confirm("このログを削除しますか？")) return

    try {
      const response = await fetch(`/api/admin/basic-info-logs/${id}?password=admin2024`, {
        method: "DELETE",
      })
      const result = await response.json()

      if (result.success) {
        await fetchLogs()
        alert("ログが削除されました")
      } else {
        alert("削除に失敗しました: " + result.message)
      }
    } catch (error) {
      console.error("削除エラー:", error)
      alert("削除に失敗しました")
    }
  }

  const deleteAllLogs = async () => {
    if (!confirm("全てのログを削除しますか？この操作は取り消せません。")) return

    try {
      const response = await fetch(`/api/admin/basic-info-logs?password=admin2024`, {
        method: "DELETE",
      })
      const result = await response.json()

      if (result.success) {
        await fetchLogs()
        alert("全てのログが削除されました")
      } else {
        alert("削除に失敗しました: " + result.message)
      }
    } catch (error) {
      console.error("削除エラー:", error)
      alert("削除に失敗しました")
    }
  }

  const exportToCSV = () => {
    const headers = [
      "ID",
      "名前",
      "ふりがな",
      "年齢",
      "性別",
      "電話番号",
      "メール",
      "住所",
      "郵便番号",
      "生年月日",
      "登録日時",
      "IP",
      "ユーザーエージェント",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map((log) =>
        [
          log.id,
          log.name,
          log.furigana || "",
          log.age,
          log.gender || "",
          log.phone,
          log.email || "",
          log.address,
          log.postalCode || "",
          log.birthDate || "",
          new Date(log.timestamp).toLocaleString("ja-JP"),
          log.ip || "",
          log.userAgent || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `basic-info-logs-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (!term) {
      setFilteredLogs(logs)
    } else {
      const filtered = logs.filter(
        (log) =>
          log.name.toLowerCase().includes(term.toLowerCase()) ||
          log.phone.includes(term) ||
          log.email?.toLowerCase().includes(term.toLowerCase()) ||
          log.address.toLowerCase().includes(term.toLowerCase()),
      )
      setFilteredLogs(filtered)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">管理画面ログイン</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="パスワードを入力"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && authenticate()}
              />
            </div>
            <Button onClick={authenticate} className="w-full">
              ログイン
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">基本情報ログ管理</h1>
          <div className="flex items-center space-x-4">
            <Badge variant="outline">{filteredLogs.length} 件</Badge>
            <Button onClick={fetchLogs} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              更新
            </Button>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              CSV出力
            </Button>
            <Button onClick={deleteAllLogs} variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              全削除
            </Button>
          </div>
        </div>

        {/* 検索バー */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="名前、電話番号、メール、住所で検索..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* ログ一覧 */}
        <div className="grid gap-4">
          {filteredLogs.map((log) => (
            <Card key={log.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="font-semibold text-lg">{log.name}</h3>
                      {log.furigana && <span className="text-sm text-gray-500">({log.furigana})</span>}
                      {log.age && <Badge variant="secondary">{log.age}歳</Badge>}
                      {log.gender && <Badge variant="outline">{log.gender}</Badge>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>📞 {log.phone}</div>
                      {log.email && <div>📧 {log.email}</div>}
                      <div className="md:col-span-2">🏠 {log.address}</div>
                      <div>📅 {new Date(log.timestamp).toLocaleString("ja-JP")}</div>
                      <div>🌐 {log.ip}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedLog(log)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>詳細情報</DialogTitle>
                        </DialogHeader>
                        {selectedLog && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="font-semibold">ID:</label>
                                <p className="text-sm text-gray-600">{selectedLog.id}</p>
                              </div>
                              <div>
                                <label className="font-semibold">名前:</label>
                                <p>{selectedLog.name}</p>
                              </div>
                              {selectedLog.furigana && (
                                <div>
                                  <label className="font-semibold">ふりがな:</label>
                                  <p>{selectedLog.furigana}</p>
                                </div>
                              )}
                              {selectedLog.age && (
                                <div>
                                  <label className="font-semibold">年齢:</label>
                                  <p>{selectedLog.age}歳</p>
                                </div>
                              )}
                              {selectedLog.gender && (
                                <div>
                                  <label className="font-semibold">性別:</label>
                                  <p>{selectedLog.gender}</p>
                                </div>
                              )}
                              {selectedLog.birthDate && (
                                <div>
                                  <label className="font-semibold">生年月日:</label>
                                  <p>{selectedLog.birthDate}</p>
                                </div>
                              )}
                              <div>
                                <label className="font-semibold">電話番号:</label>
                                <p>{selectedLog.phone}</p>
                              </div>
                              {selectedLog.email && (
                                <div>
                                  <label className="font-semibold">メール:</label>
                                  <p>{selectedLog.email}</p>
                                </div>
                              )}
                              {selectedLog.postalCode && (
                                <div>
                                  <label className="font-semibold">郵便番号:</label>
                                  <p>{selectedLog.postalCode}</p>
                                </div>
                              )}
                              <div className="col-span-2">
                                <label className="font-semibold">住所:</label>
                                <p>{selectedLog.address}</p>
                              </div>
                              <div>
                                <label className="font-semibold">登録日時:</label>
                                <p>{new Date(selectedLog.timestamp).toLocaleString("ja-JP")}</p>
                              </div>
                              <div>
                                <label className="font-semibold">IP アドレス:</label>
                                <p className="text-sm">{selectedLog.ip}</p>
                              </div>
                              <div className="col-span-2">
                                <label className="font-semibold">ユーザーエージェント:</label>
                                <p className="text-xs text-gray-600 break-all">{selectedLog.userAgent}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => deleteLog(log.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLogs.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">ログが見つかりません</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">読み込み中...</p>
          </div>
        )}
      </div>
    </div>
  )
}
