"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Eye, Edit, Plus, RefreshCw, FileText, Briefcase } from "lucide-react"
import Link from "next/link"

interface Document {
  id: string
  title: string
  type: "resume" | "career"
  created_at: string
  updated_at: string
  content: any
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "resume" | "career">("all")
  const [sortBy, setSortBy] = useState<"created_at" | "updated_at" | "title">("updated_at")

  const loadDocuments = () => {
    try {
      setLoading(true)

      // Load documents from localStorage
      const savedDocuments = localStorage.getItem("savedDocuments")
      if (savedDocuments) {
        const parsedDocuments = JSON.parse(savedDocuments)
        setDocuments(parsedDocuments)
      } else {
        setDocuments([])
      }
    } catch (error) {
      console.error("Error loading documents:", error)
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  const deleteDocument = (id: string) => {
    if (!confirm("このドキュメントを削除しますか？")) return

    try {
      const updatedDocuments = documents.filter((doc) => doc.id !== id)
      setDocuments(updatedDocuments)
      localStorage.setItem("savedDocuments", JSON.stringify(updatedDocuments))
    } catch (error) {
      console.error("Delete error:", error)
      alert("削除に失敗しました")
    }
  }

  const filteredAndSortedDocuments = documents
    .filter((doc) => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || doc.type === filterType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      }
      return new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime()
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">履歴書・職務経歴書管理</h1>
            <Link href="/">
              <Button variant="outline">ホームに戻る</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Link href="/select">
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  新しい書類を作成
                </Button>
              </Link>
              <Button onClick={loadDocuments} variant="outline" disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                更新
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="ドキュメントを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={filterType} onValueChange={(value: "all" | "resume" | "career") => setFilterType(value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="タイプで絞り込み" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="resume">履歴書</SelectItem>
                  <SelectItem value="career">職務経歴書</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value: "created_at" | "updated_at" | "title") => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="並び順" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated_at">更新日時</SelectItem>
                  <SelectItem value="created_at">作成日時</SelectItem>
                  <SelectItem value="title">タイトル</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredAndSortedDocuments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {documents.length === 0
                  ? "まだドキュメントがありません。新しい履歴書を作成してみましょう。"
                  : "検索条件に一致するドキュメントがありません。"}
              </p>
              {documents.length === 0 && (
                <Link href="/select">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    履歴書を作成する
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedDocuments.map((document) => (
                <Card key={document.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg flex items-center">
                        {document.type === "resume" ? (
                          <FileText className="w-5 h-5 mr-2 text-blue-600" />
                        ) : (
                          <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                        )}
                        {document.title}
                      </CardTitle>
                      <Badge variant={document.type === "resume" ? "default" : "secondary"}>
                        {document.type === "resume" ? "履歴書" : "職務経歴書"}
                      </Badge>
                    </div>
                    <CardDescription>
                      作成: {new Date(document.created_at).toLocaleDateString("ja-JP")}
                      <br />
                      更新: {new Date(document.updated_at).toLocaleDateString("ja-JP")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Link href={`/preview?id=${document.id}`} className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent">
                          <Eye className="w-4 h-4 mr-1" />
                          表示
                        </Button>
                      </Link>
                      <Link href={`/edit/${document.id}`} className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent">
                          <Edit className="w-4 h-4 mr-1" />
                          編集
                        </Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => deleteDocument(document.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
