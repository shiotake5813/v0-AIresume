"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Home, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface QualificationEntry {
  id: string
  name: string
  level: string
  description: string
}

interface Step5Data {
  qualifications: QualificationEntry[]
  additionalInfo: string
}

export default function Step5ResumePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Step5Data>({
    qualifications: [{ id: "1", name: "", level: "", description: "" }],
    additionalInfo: "",
  })

  useEffect(() => {
    const savedData = sessionStorage.getItem("resumeStep5")
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  const addQualificationEntry = () => {
    const newEntry: QualificationEntry = {
      id: Date.now().toString(),
      name: "",
      level: "",
      description: "",
    }
    setFormData((prev) => ({
      ...prev,
      qualifications: [...prev.qualifications, newEntry],
    }))
  }

  const removeQualificationEntry = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((entry) => entry.id !== id),
    }))
  }

  const updateQualificationEntry = (id: string, field: keyof QualificationEntry, value: string) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)),
    }))
  }

  const handleNext = () => {
    sessionStorage.setItem("resumeStep5", JSON.stringify(formData))
    router.push("/create-steps/6-resume")
  }

  const handleBack = () => {
    sessionStorage.setItem("resumeStep5", JSON.stringify(formData))
    router.push("/create-steps/4-resume")
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
          <div className="flex-1 bg-gray-200 h-2 rounded-full"></div>
          <div className="flex-1 bg-gray-200 h-2 rounded-full"></div>
        </div>
        <p className="text-sm text-gray-600 text-center">ステップ 5/7: 技能・資格詳細</p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* 技能・資格詳細 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">技能・資格詳細</CardTitle>
              <Button variant="outline" size="sm" onClick={addQualificationEntry}>
                <Plus className="w-4 h-4 mr-1" />
                追加
              </Button>
            </div>
            <p className="text-sm text-gray-600">技能レベルや詳細な説明を追加してください（任意）</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.qualifications.map((entry, index) => (
              <div key={entry.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">技能 {index + 1}</span>
                  {formData.qualifications.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => removeQualificationEntry(entry.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div>
                  <Label>技能・資格名</Label>
                  <Input
                    value={entry.name}
                    onChange={(e) => updateQualificationEntry(entry.id, "name", e.target.value)}
                    placeholder="例：フォークリフト操作"
                  />
                </div>

                <div>
                  <Label>レベル・経験年数</Label>
                  <Input
                    value={entry.level}
                    onChange={(e) => updateQualificationEntry(entry.id, "level", e.target.value)}
                    placeholder="例：3年、初級、上級"
                  />
                </div>

                <div>
                  <Label>詳細説明</Label>
                  <Textarea
                    value={entry.description}
                    onChange={(e) => updateQualificationEntry(entry.id, "description", e.target.value)}
                    placeholder="具体的な経験や実績を記入してください..."
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 補足情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">補足情報</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData((prev) => ({ ...prev, additionalInfo: e.target.value }))}
              placeholder="その他アピールしたいことがあれば記入してください..."
              rows={4}
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
