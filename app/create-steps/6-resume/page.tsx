"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Step6Data {
  workPreferences: string
  salaryExpectation: string
  workLocation: string
  startDate: string
  workingHours: string
  otherRequests: string
}

export default function Step6ResumePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Step6Data>({
    workPreferences: "",
    salaryExpectation: "",
    workLocation: "",
    startDate: "",
    workingHours: "",
    otherRequests: "",
  })

  useEffect(() => {
    const savedData = sessionStorage.getItem("resumeStep6")
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  const handleInputChange = (field: keyof Step6Data, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    sessionStorage.setItem("resumeStep6", JSON.stringify(formData))
    router.push("/create-steps/7-resume")
  }

  const handleBack = () => {
    sessionStorage.setItem("resumeStep6", JSON.stringify(formData))
    router.push("/create-steps/5-resume")
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
          <div className="flex-1 bg-blue-600 h-2 rounded-full"></div>
          <div className="flex-1 bg-blue-600 h-2 rounded-full"></div>
          <div className="flex-1 bg-gray-200 h-2 rounded-full"></div>
        </div>
        <p className="text-sm text-gray-600 text-center">ステップ 6/7: 希望条件</p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* 希望職種 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">希望職種・業務内容</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.workPreferences}
              onChange={(e) => handleInputChange("workPreferences", e.target.value)}
              placeholder="希望する職種や業務内容を記入してください..."
              rows={3}
            />
          </CardContent>
        </Card>

        {/* 希望給与 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">希望給与</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={formData.salaryExpectation}
              onChange={(e) => handleInputChange("salaryExpectation", e.target.value)}
              placeholder="例：月給25万円以上、時給1,200円以上"
            />
          </CardContent>
        </Card>

        {/* 勤務地希望 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">勤務地希望</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={formData.workLocation}
              onChange={(e) => handleInputChange("workLocation", e.target.value)}
              placeholder="例：東京都内、通勤時間1時間以内"
            />
          </CardContent>
        </Card>

        {/* 入社可能日 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">入社可能日</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              placeholder="例：即日、2024年4月1日以降"
            />
          </CardContent>
        </Card>

        {/* 勤務時間希望 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">勤務時間希望</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={formData.workingHours}
              onChange={(e) => handleInputChange("workingHours", e.target.value)}
              placeholder="例：9:00-18:00、シフト制可"
            />
          </CardContent>
        </Card>

        {/* その他の要望 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">その他の要望</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.otherRequests}
              onChange={(e) => handleInputChange("otherRequests", e.target.value)}
              placeholder="その他の希望や要望があれば記入してください..."
              rows={3}
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
