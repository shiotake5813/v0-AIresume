"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Home, FileText, Download, Edit, Sparkles, Printer } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Step7ResumePage() {
  const router = useRouter()
  const [resumeData, setResumeData] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResume, setGeneratedResume] = useState("")

  useEffect(() => {
    // 全ステップのデータを収集
    const step1 = JSON.parse(sessionStorage.getItem("resumeStep1") || "{}")
    const step2 = JSON.parse(sessionStorage.getItem("resumeStep2") || "{}")
    const step3 = JSON.parse(sessionStorage.getItem("resumeStep3") || "{}")
    const step4 = JSON.parse(sessionStorage.getItem("resumeStep4") || "{}")
    const step5 = JSON.parse(sessionStorage.getItem("resumeStep5") || "{}")
    const step6 = JSON.parse(sessionStorage.getItem("resumeStep6") || "{}")

    const allData = {
      personalInfo: step1,
      education: step2.education || [],
      work: step2.work || [],
      licenses: step3.licenses || [],
      motivation: step4.motivation || "",
      selfPR: step4.selfPR || "",
      specialSkills: step4.specialSkills || "",
      hobbies: step4.hobbies || "",
      qualifications: step5.qualifications || [],
      additionalInfo: step5.additionalInfo || "",
      workPreferences: step6.workPreferences || "",
      salaryExpectation: step6.salaryExpectation || "",
      workLocation: step6.workLocation || "",
      startDate: step6.startDate || "",
      workingHours: step6.workingHours || "",
      otherRequests: step6.otherRequests || "",
    }

    setResumeData(allData)
  }, [])

  const generateFullResume = async () => {
    if (!resumeData) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-full-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedResume(data.resume)
        if (data.warning) {
          alert(data.warning)
        }
      } else {
        throw new Error("履歴書生成に失敗しました")
      }
    } catch (error) {
      console.error("履歴書生成エラー:", error)
      alert("履歴書生成に失敗しました。もう一度お試しください。")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => {
    if (resumeData) {
      // ローカルストレージに保存
      const savedResumes = JSON.parse(localStorage.getItem("savedResumes") || "[]")
      const newResume = {
        id: Date.now().toString(),
        type: "resume",
        title: `履歴書 - ${resumeData.personalInfo.name || "無題"}`,
        data: resumeData,
        generatedContent: generatedResume,
        createdAt: new Date().toISOString(),
      }
      savedResumes.push(newResume)
      localStorage.setItem("savedResumes", JSON.stringify(savedResumes))

      alert("履歴書を保存しました！")
    }
  }

  const handlePrint = () => {
    if (generatedResume) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>履歴書</title>
              <style>
                body { font-family: 'MS Gothic', monospace; font-size: 12px; line-height: 1.4; margin: 20px; }
                .resume-content { white-space: pre-wrap; }
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="resume-content">${generatedResume.replace(/\n/g, "<br>")}</div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const handleBack = () => {
    router.push("/create-steps/6-resume")
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <h1 className="text-xl font-bold text-gray-900">履歴書完成</h1>
          <Link href="/">
            <Button variant="outline" size="sm" className="text-blue-600 bg-transparent">
              <Home className="w-4 h-4 mr-1" />
              ホーム
            </Button>
          </Link>
        </div>

        {/* Progress */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="flex-1 bg-blue-600 h-2 rounded-full"></div>
          <div className="flex-1 bg-blue-600 h-2 rounded-full"></div>
          <div className="flex-1 bg-blue-600 h-2 rounded-full"></div>
          <div className="flex-1 bg-blue-600 h-2 rounded-full"></div>
          <div className="flex-1 bg-blue-600 h-2 rounded-full"></div>
          <div className="flex-1 bg-blue-600 h-2 rounded-full"></div>
          <div className="flex-1 bg-blue-600 h-2 rounded-full"></div>
        </div>
        <p className="text-sm text-gray-600 text-center">ステップ 7/7: 完成・プレビュー</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* 完成メッセージ */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">履歴書が完成しました！</CardTitle>
            <p className="text-gray-600">
              入力いただいた情報をもとに履歴書を作成しました。
              <br />
              AIで最適化された内容を生成することも可能です。
            </p>
          </CardHeader>
        </Card>

        {/* アクションボタン */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button
            onClick={generateFullResume}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating ? "生成中..." : "AI最適化"}
          </Button>

          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            保存
          </Button>

          <Button
            onClick={handlePrint}
            disabled={!generatedResume}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Printer className="w-4 h-4 mr-2" />
            印刷
          </Button>

          <Button variant="outline" onClick={() => router.push("/create-steps/1-resume")}>
            <Edit className="w-4 h-4 mr-2" />
            編集
          </Button>
        </div>

        {/* 入力データプレビュー */}
        {resumeData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>入力データ確認</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {/* 基本情報 */}
                <div>
                  <h3 className="font-bold text-lg mb-2">基本情報</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>ふりがな: {resumeData.personalInfo.furigana || "未入力"}</div>
                    <div>氏名: {resumeData.personalInfo.name || "未入力"}</div>
                    <div>生年月日: {resumeData.personalInfo.birthDate || "未入力"}</div>
                    <div>年齢: {resumeData.personalInfo.age || "未入力"}歳</div>
                    <div>性別: {resumeData.personalInfo.gender || "未入力"}</div>
                    <div>住所: {resumeData.personalInfo.address || "未入力"}</div>
                    <div>電話番号: {resumeData.personalInfo.phone || "未入力"}</div>
                    <div>メール: {resumeData.personalInfo.email || "未入力"}</div>
                  </div>
                </div>

                {/* 学歴 */}
                {resumeData.education.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg mb-2">学歴</h3>
                    <div className="space-y-1 text-sm">
                      {resumeData.education.map((edu: any, index: number) => (
                        <div key={index}>
                          {edu.year}年{edu.month}月 {edu.school} {edu.department} {edu.status}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 職歴 */}
                {resumeData.work.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg mb-2">職歴</h3>
                    <div className="space-y-1 text-sm">
                      {resumeData.work.map((work: any, index: number) => (
                        <div key={index}>
                          {work.year}年{work.month}月 {work.company} {work.position} {work.status}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 免許・資格 */}
                {resumeData.licenses.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg mb-2">免許・資格</h3>
                    <div className="space-y-1 text-sm">
                      {resumeData.licenses.map((license: any, index: number) => (
                        <div key={index}>
                          {license.year}年{license.month}月 {license.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 志望動機・自己PR */}
                {(resumeData.motivation || resumeData.selfPR) && (
                  <div>
                    <h3 className="font-bold text-lg mb-2">志望動機・自己PR</h3>
                    {resumeData.motivation && (
                      <div className="mb-2">
                        <strong>志望動機:</strong>
                        <p className="text-sm whitespace-pre-wrap">{resumeData.motivation}</p>
                      </div>
                    )}
                    {resumeData.selfPR && (
                      <div>
                        <strong>自己PR:</strong>
                        <p className="text-sm whitespace-pre-wrap">{resumeData.selfPR}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI生成結果 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                  AI最適化された履歴書
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedResume ? (
                  <div className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    {generatedResume}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>「AI最適化」ボタンをクリックして</p>
                    <p>プロフェッショナルな履歴書を生成してください</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* 次のアクション */}
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-gray-600 mb-4">履歴書作成が完了しました。新しい書類を作成しますか？</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => router.push("/select")} variant="outline" className="text-blue-600">
                新しい書類を作成
              </Button>
              <Button onClick={() => router.push("/dashboard")} className="bg-blue-600 hover:bg-blue-700">
                ダッシュボードへ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
