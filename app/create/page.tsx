"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Edit, Download, FileDown, RefreshCw, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

export default function CreateResumePage() {
  const [resumeData, setResumeData] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const resumeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // ステップで入力されたデータを取得
    const formData = JSON.parse(sessionStorage.getItem("formData") || "{}")
    setResumeData(formData)

    // 自動で履歴書を生成
    if (formData && Object.keys(formData).length > 0) {
      generateResume(formData)
    }
  }, [])

  const generateResume = async (formData: any) => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-resume-preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
      })

      if (!response.ok) {
        throw new Error("履歴書の生成に失敗しました")
      }

      const data = await response.json()
      setGeneratedContent(data)
    } catch (error) {
      console.error("Error:", error)
      alert("履歴書の生成に失敗しました。")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegenerate = () => {
    if (resumeData) {
      generateResume(resumeData)
    }
  }

  const handleEdit = () => {
    window.history.back()
  }

  const handlePDFDownload = () => {
    console.log("PDFダウンロード")
  }

  const handleWordDownload = () => {
    console.log("Wordダウンロード")
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    ダッシュボードに戻る
                  </Button>
                </Link>
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h1 className="text-xl font-bold text-gray-900">履歴書作成</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">AI履歴書生成中...</h2>
              <p className="text-gray-600">入力された情報を基に最適な履歴書を作成しています</p>
              <div className="mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!generatedContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">履歴書データが見つかりません</p>
            <Button asChild>
              <Link href="/create-steps/1">情報入力に戻る</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  ダッシュボードに戻る
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">履歴書プレビュー</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl flex-1">
        {/* Resume Content - Standard Japanese Format */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div
            ref={resumeRef}
            className="p-8"
            style={{
              fontFamily: "'MS Gothic', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', monospace",
              fontSize: "12px",
              lineHeight: "1.4",
              color: "#000",
              width: "210mm", // A4 width
              minHeight: "297mm", // A4 height
            }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-4" style={{ fontSize: "24px", letterSpacing: "8px" }}>
                履歴書
              </h1>
              <div className="text-right text-sm">{generatedContent.createdDate.formatted}</div>
            </div>

            {/* Personal Information Section */}
            <table className="w-full border-2 border-black mb-6" style={{ borderCollapse: "collapse" }}>
              <tbody>
                {/* Name Row */}
                <tr>
                  <td
                    className="border border-black p-2 text-center font-bold bg-gray-100"
                    style={{ width: "80px", fontSize: "11px" }}
                  >
                    ふりがな
                  </td>
                  <td className="border border-black p-2" style={{ width: "200px" }}>
                    {generatedContent.basicInfo.nameKana}
                  </td>
                  <td rowSpan={5} className="border border-black p-2 text-center align-top" style={{ width: "100px" }}>
                    <div
                      className="border border-gray-400 mx-auto flex items-center justify-center text-xs text-gray-500"
                      style={{ width: "80px", height: "100px" }}
                    >
                      写真を貼る位置
                      <br />
                      (縦4cm×横3cm)
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 text-center font-bold bg-gray-100">氏名</td>
                  <td className="border border-black p-2 text-lg font-bold" style={{ fontSize: "16px" }}>
                    {generatedContent.basicInfo.name}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 text-center font-bold bg-gray-100">生年月日</td>
                  <td className="border border-black p-2">
                    {generatedContent.basicInfo.age ? `満${generatedContent.basicInfo.age}歳` : ""}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 text-center font-bold bg-gray-100">性別</td>
                  <td className="border border-black p-2">{generatedContent.basicInfo.gender}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 text-center font-bold bg-gray-100">電話</td>
                  <td className="border border-black p-2">{generatedContent.basicInfo.phone}</td>
                </tr>
              </tbody>
            </table>

            {/* Address Section */}
            <table className="w-full border-2 border-black mb-6" style={{ borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td className="border border-black p-2 text-center font-bold bg-gray-100" style={{ width: "80px" }}>
                    ふりがな
                  </td>
                  <td className="border border-black p-2">{generatedContent.basicInfo.addressKana}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 text-center font-bold bg-gray-100">現住所</td>
                  <td className="border border-black p-2">
                    〒{generatedContent.basicInfo.postalCode} {generatedContent.basicInfo.address}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 text-center font-bold bg-gray-100">E-mail</td>
                  <td className="border border-black p-2">{generatedContent.basicInfo.email}</td>
                </tr>
              </tbody>
            </table>

            {/* Education and Work History */}
            <table className="w-full border-2 border-black mb-6" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    colSpan={3}
                    className="border border-black p-2 text-center font-bold bg-gray-100"
                    style={{ fontSize: "14px" }}
                  >
                    学歴・職歴（各別にまとめて書く）
                  </th>
                </tr>
                <tr>
                  <th className="border border-black p-2 text-center font-bold bg-gray-50" style={{ width: "60px" }}>
                    年
                  </th>
                  <th className="border border-black p-2 text-center font-bold bg-gray-50" style={{ width: "40px" }}>
                    月
                  </th>
                  <th className="border border-black p-2 text-center font-bold bg-gray-50">学歴・職歴</th>
                </tr>
              </thead>
              <tbody>
                {generatedContent.educationWorkHistory.length > 0 ? (
                  generatedContent.educationWorkHistory.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="border border-black p-2 text-center" style={{ height: "30px" }}>
                        {item.year}
                      </td>
                      <td className="border border-black p-2 text-center">{item.month}</td>
                      <td
                        className={`border border-black p-2 ${item.isHeader ? "font-bold text-center" : ""}`}
                        style={{ fontSize: item.isHeader ? "12px" : "11px" }}
                      >
                        {item.content}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border border-black p-2 text-center" style={{ height: "30px" }}></td>
                    <td className="border border-black p-2 text-center"></td>
                    <td className="border border-black p-2"></td>
                  </tr>
                )}
                {/* Empty rows for standard format */}
                {Array.from({ length: Math.max(0, 10 - generatedContent.educationWorkHistory.length) }).map(
                  (_, index) => (
                    <tr key={`empty-${index}`}>
                      <td className="border border-black p-2" style={{ height: "30px" }}></td>
                      <td className="border border-black p-2"></td>
                      <td className="border border-black p-2"></td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>

            {/* Licenses and Qualifications */}
            <table className="w-full border-2 border-black mb-6" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    colSpan={3}
                    className="border border-black p-2 text-center font-bold bg-gray-100"
                    style={{ fontSize: "14px" }}
                  >
                    免許・資格
                  </th>
                </tr>
                <tr>
                  <th className="border border-black p-2 text-center font-bold bg-gray-50" style={{ width: "60px" }}>
                    年
                  </th>
                  <th className="border border-black p-2 text-center font-bold bg-gray-50" style={{ width: "40px" }}>
                    月
                  </th>
                  <th className="border border-black p-2 text-center font-bold bg-gray-50">資格・免許</th>
                </tr>
              </thead>
              <tbody>
                {generatedContent.licenses.length > 0 ? (
                  generatedContent.licenses.map((license: any, index: number) => (
                    <tr key={index}>
                      <td className="border border-black p-2 text-center" style={{ height: "30px" }}>
                        {license.year}
                      </td>
                      <td className="border border-black p-2 text-center">{license.month}</td>
                      <td className="border border-black p-2">{license.content}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border border-black p-2 text-center" style={{ height: "30px" }}></td>
                    <td className="border border-black p-2 text-center"></td>
                    <td className="border border-black p-2 text-center">特になし</td>
                  </tr>
                )}
                {/* Empty rows */}
                {Array.from({ length: Math.max(0, 6 - generatedContent.licenses.length) }).map((_, index) => (
                  <tr key={`empty-license-${index}`}>
                    <td className="border border-black p-2" style={{ height: "30px" }}></td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Self-PR Section */}
            <table className="w-full border-2 border-black mb-6" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    className="border border-black p-2 text-center font-bold bg-gray-100"
                    style={{ fontSize: "12px" }}
                  >
                    志望の動機、特技、好きな学科、アピールポイントなど
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-4" style={{ height: "150px", verticalAlign: "top" }}>
                    <div className="whitespace-pre-wrap leading-relaxed" style={{ fontSize: "11px" }}>
                      {generatedContent.selfPR || ""}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Personal Request Section */}
            <table className="w-full border-2 border-black" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    className="border border-black p-2 font-bold bg-gray-100"
                    style={{ width: "120px", fontSize: "11px" }}
                  >
                    本人希望記入欄
                  </th>
                  <th
                    className="border border-black p-2 text-right font-normal bg-gray-100"
                    style={{ fontSize: "9px" }}
                  >
                    （特に給料・職種・勤務時間・勤務地・その他についての希望があれば記入）
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={2} className="border border-black p-4" style={{ height: "80px", verticalAlign: "top" }}>
                    <div className="whitespace-pre-wrap leading-relaxed" style={{ fontSize: "11px" }}>
                      {generatedContent.personalRequest}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Footer Note */}
            <div className="text-center mt-4" style={{ fontSize: "9px", color: "#666" }}>
              ※「年」「月」は記載年月日です。本欄に記載することが困難です。
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button variant="outline" className="w-full bg-transparent" onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            情報を編集する
          </Button>

          <Button variant="outline" className="w-full bg-transparent" onClick={handlePDFDownload}>
            <Download className="w-4 h-4 mr-2" />
            PDFでダウンロード
          </Button>

          <Button variant="outline" className="w-full bg-transparent" onClick={handleWordDownload}>
            <FileDown className="w-4 h-4 mr-2" />
            Wordでダウンロード
          </Button>

          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleRegenerate}>
            <RefreshCw className="w-4 h-4 mr-2" />
            再生成
          </Button>
        </div>

        {/* Save to Dashboard */}
        <div className="text-center mt-8">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href="/dashboard">
              <FileText className="w-4 h-4 mr-2" />
              ダッシュボードに保存
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
