"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Home, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Step4Data {
  motivation: string
  selfPR: string
  specialSkills: string
  hobbies: string
}

export default function Step4ResumePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Step4Data>({
    motivation: "",
    selfPR: "",
    specialSkills: "",
    hobbies: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatingField, setGeneratingField] = useState<string>("")

  useEffect(() => {
    const savedData = sessionStorage.getItem("resumeStep4")
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  const handleInputChange = (field: keyof Step4Data, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateAIContent = async (field: keyof Step4Data) => {
    setIsGenerating(true)
    setGeneratingField(field)
    try {
      // 他のステップのデータを取得
      const step1Data = JSON.parse(sessionStorage.getItem("resumeStep1") || "{}")
      const step2Data = JSON.parse(sessionStorage.getItem("resumeStep2") || "{}")
      const step3Data = JSON.parse(sessionStorage.getItem("resumeStep3") || "{}")

      const response = await fetch("/api/generate-resume-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field,
          personalInfo: step1Data,
          education: step2Data.education || [],
          work: step2Data.work || [],
          licenses: step3Data.licenses || [],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        handleInputChange(field, data.text)
      } else {
        throw new Error("AI生成に失敗しました")
      }
    } catch (error) {
      console.error("AI生成エラー:", error)
      alert("AI生成に失敗しました。もう一度お試しください。")
    } finally {
      setIsGenerating(false)
      setGeneratingField("")
    }
  }

  const handleNext = () => {
    sessionStorage.setItem("resumeStep4", JSON.stringify(formData))
    router.push("/create-steps/5-resume")
  }

  const handleBack = () => {
    sessionStorage.setItem("resumeStep4", JSON.stringify(formData))
    router.push("/create-steps/3-resume")
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      {/* Header */}
      <div className="max-w-md mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <h1 className="text-xl font-bold text-gray-900">履歴書作成</h1>
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
          <div className="flex-1 bg-gray-200 h-2 rounded-full"></div>
          <div className="flex-1 bg-gray-200 h-2 rounded-full"></div>
          <div className="flex-1 bg-gray-200 h-2 rounded-full"></div>
        </div>
        <p className="text-sm text-gray-600 text-center">ステップ 4/7: 志望動機・自己PR</p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* 志望動機 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">志望動機</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateAIContent("motivation")}
                disabled={isGenerating}
              >
                <Sparkles className="w-4 h-4 mr-1" />
                {isGenerating && generatingField === "motivation" ? "生成中..." : "AI生成"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.motivation}
              onChange={(e) => handleInputChange("motivation", e.target.value)}
              placeholder="なぜこの会社で働きたいのか、どのような貢献ができるかを記入してください..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* 自己PR */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">自己PR</CardTitle>
              <Button variant="outline" size="sm" onClick={() => generateAIContent("selfPR")} disabled={isGenerating}>
                <Sparkles className="w-4 h-4 mr-1" />
                {isGenerating && generatingField === "selfPR" ? "生成中..." : "AI生成"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.selfPR}
              onChange={(e) => handleInputChange("selfPR", e.target.value)}
              placeholder="あなたの強みや特技、アピールポイントを記入してください..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* 特技 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">特技</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateAIContent("specialSkills")}
                disabled={isGenerating}
              >
                <Sparkles className="w-4 h-4 mr-1" />
                {isGenerating && generatingField === "specialSkills" ? "生成中..." : "AI生成"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.specialSkills}
              onChange={(e) => handleInputChange("specialSkills", e.target.value)}
              placeholder="得意なことや専門スキルを記入してください..."
              rows={3}
            />
          </CardContent>
        </Card>

        {/* 趣味 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">趣味</CardTitle>
              <Button variant="outline" size="sm" onClick={() => generateAIContent("hobbies")} disabled={isGenerating}>
                <Sparkles className="w-4 h-4 mr-1" />
                {isGenerating && generatingField === "hobbies" ? "生成中..." : "AI生成"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.hobbies}
              onChange={(e) => handleInputChange("hobbies", e.target.value)}
              placeholder="趣味や興味のあることを記入してください..."
              rows={2}
            />
          </CardContent>
        </Card>

        <Button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700">
          次へ
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
