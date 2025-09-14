"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, ArrowLeft, FileText, Home } from "lucide-react"
import Link from "next/link"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

interface ResumeData {
  documentType: string
  step1: {
    documentName?: string
    createdDate?: string
  }
  step2: {
    name?: string
    age?: string
    gender?: string
    phone?: string
    email?: string
    postalCode?: string
    address?: string
    addressFurigana?: string
  }
  step3: {
    educations?: Array<{
      id: number
      date: string
      content: string
    }>
    workHistories?: Array<{
      id: number
      date: string
      content: string
    }>
  }
  step4: {
    licenses?: Array<{
      id: number
      date: string
      content: string
    }>
  }
  step5: {
    selfPR?: string
  }
  step6: {
    personalRequest?: string
  }
}

export default function ResultPage() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const resumeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 各ステップのデータを読み込み
    const formData = JSON.parse(sessionStorage.getItem("formData") || "{}")
    const documentType = sessionStorage.getItem("documentType")

    if (!formData || !documentType) {
      return
    }

    // 履歴書データを構築
    const resumeData = {
      documentType,
      step1: formData.step1 || {},
      step2: formData.step2 || {},
      step3: formData.step3 || {},
      step4: formData.step4 || {},
      step5: formData.step5 || {},
      step6: formData.step6 || {},
    }

    setResumeData(resumeData)
  }, [])

  const handleDownloadPDF = async () => {
    if (!resumeData || !resumeRef.current) return

    setIsGeneratingPDF(true)

    try {
      // HTMLをキャンバスに変換
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2, // 高解像度で生成
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: resumeRef.current.scrollWidth,
        height: resumeRef.current.scrollHeight,
      })

      // キャンバスから画像データを取得
      const imgData = canvas.toDataURL("image/png")

      // PDFを作成
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // A4サイズに合わせて画像をスケール
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 10

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)

      // PDFを保存
      const fileName = resumeData?.step2?.name
        ? `${resumeData.step2.name}_履歴書.pdf`
        : `履歴書_${new Date().toISOString().split("T")[0]}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error("PDF生成エラー:", error)
      alert("PDFの生成に失敗しました。もう一度お試しください。")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">履歴書データが見つかりません</p>
            <Button asChild>
              <Link href="/select">書類作成に戻る</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              戻る
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">履歴書完成</h1>
          <Link href="/">
            <Button variant="outline" size="sm" className="text-blue-600 bg-transparent">
              <Home className="w-4 h-4 mr-1" />
              ホーム
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Message */}
        <Card className="border-0 shadow-md bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-green-900 mb-2">履歴書が完成しました！</h2>
            <p className="text-green-700">内容を確認して、PDFでダウンロードしてください</p>
          </CardContent>
        </Card>

        {/* Resume Content - PDF生成用の参照要素 */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">生成された履歴書</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div
              ref={resumeRef}
              className="bg-white border rounded-lg p-8"
              style={{
                fontFamily:
                  "'Noto Sans JP', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif",
                lineHeight: "1.8",
                fontSize: "14px",
                color: "#333333",
              }}
            >
              {/* 履歴書ヘッダー */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-4" style={{ fontSize: "24px", marginBottom: "16px" }}>
                  履歴書
                </h1>
                <div className="text-right text-sm text-gray-600">
                  作成日:{" "}
                  {resumeData?.step1?.createdDate
                    ? new Date(resumeData.step1.createdDate).toLocaleDateString("ja-JP")
                    : new Date().toLocaleDateString("ja-JP")}
                </div>
              </div>

              {/* 基本情報 */}
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4 pb-2 border-b-2 border-blue-600">基本情報</h2>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex">
                    <span className="font-medium w-24">氏名:</span>
                    <span>{resumeData?.step2?.name || ""}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24">年齢:</span>
                    <span>{resumeData?.step2?.age ? `${resumeData.step2.age}歳` : ""}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24">性別:</span>
                    <span>{resumeData?.step2?.gender || ""}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24">住所:</span>
                    <span>{resumeData?.step2?.address || ""}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24">電話番号:</span>
                    <span>{resumeData?.step2?.phone || ""}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24">メール:</span>
                    <span>{resumeData?.step2?.email || ""}</span>
                  </div>
                </div>
              </div>

              {/* 学歴・職歴 */}
              {(resumeData?.step3?.educations?.length > 0 || resumeData?.step3?.workHistories?.length > 0) && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold mb-4 pb-2 border-b-2 border-blue-600">学歴・職歴</h2>
                  <div className="space-y-3">
                    {/* 学歴 */}
                    {resumeData?.step3?.educations?.length > 0 && (
                      <>
                        <div className="font-bold text-center py-2">【学歴】</div>
                        {resumeData.step3.educations.map((edu, index) => (
                          <div key={`edu-${index}`} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-600 min-w-[100px]">{edu.date}</div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{edu.content}</div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {/* 職歴 */}
                    {resumeData?.step3?.workHistories?.length > 0 && (
                      <>
                        <div className="font-bold text-center py-2">【職歴】</div>
                        {resumeData.step3.workHistories.map((work, index) => (
                          <div key={`work-${index}`} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-600 min-w-[100px]">{work.date}</div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{work.content}</div>
                            </div>
                          </div>
                        ))}
                        <div className="text-right py-2">以上</div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* 免許・資格 */}
              {resumeData?.step4?.licenses?.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold mb-4 pb-2 border-b-2 border-blue-600">免許・資格</h2>
                  <div className="space-y-3">
                    {resumeData.step4.licenses.map((license, index) => (
                      <div key={index} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-600 min-w-[100px]">{license.date}</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{license.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 自己PR */}
              {resumeData?.step5?.selfPR && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold mb-4 pb-2 border-b-2 border-blue-600">自己PR</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{resumeData.step5.selfPR}</p>
                  </div>
                </div>
              )}

              {/* 本人希望記入欄 */}
              {resumeData?.step6?.personalRequest && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-4 pb-2 border-b-2 border-blue-600">本人希望記入欄</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {resumeData.step6.personalRequest}
                    </p>
                  </div>
                </div>
              )}
              {/* フッター */}
              <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t">以上</div>
            </div>
          </CardContent>
        </Card>

        {/* Download Button */}
        <div className="text-center space-y-4">
          <Button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            size="lg"
            className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-xl disabled:opacity-50"
          >
            {isGeneratingPDF ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                PDF作成中...
              </div>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                PDFをダウンロード
              </>
            )}
          </Button>

          <div className="text-center space-y-3">
            <Button asChild variant="outline" className="text-blue-600 bg-transparent">
              <Link href="/select">新しい履歴書を作成</Link>
            </Button>
            <div>
              <Button asChild variant="ghost" className="text-gray-600">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  ホームに戻る
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
