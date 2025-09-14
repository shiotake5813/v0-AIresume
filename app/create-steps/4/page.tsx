"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Home, X } from "lucide-react"
import Link from "next/link"

interface SkillItem {
  id: number
  content: string
}

export default function Step4Page() {
  const router = useRouter()
  const [documentType, setDocumentType] = useState<string>("")
  const [qualifications, setQualifications] = useState<SkillItem[]>([])
  const [skills, setSkills] = useState<SkillItem[]>([])
  const [showQualificationModal, setShowQualificationModal] = useState(false)
  const [showSkillModal, setShowSkillModal] = useState(false)
  const [newQualification, setNewQualification] = useState("")
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    const type = sessionStorage.getItem("documentType")
    if (!type) {
      router.push("/select")
      return
    }
    setDocumentType(type)

    // 既存データを読み込み
    const existingData = JSON.parse(sessionStorage.getItem("formData") || "{}")
    if (existingData.step4) {
      if (existingData.step4.qualifications) {
        setQualifications(
          existingData.step4.qualifications.map((item: any) => ({
            id: item.id || Date.now(),
            content: item.content || "",
          })),
        )
      }
      if (existingData.step4.skills) {
        setSkills(
          existingData.step4.skills.map((item: any) => ({
            id: item.id || Date.now(),
            content: item.content || "",
          })),
        )
      }
    }
  }, [router])

  const handleAddQualification = () => {
    if (!newQualification.trim()) {
      alert("内容を入力してください")
      return
    }

    const newId = Date.now()
    setQualifications([...qualifications, { id: newId, content: newQualification }])
    setNewQualification("")
    setShowQualificationModal(false)
  }

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      alert("内容を入力してください")
      return
    }

    const newId = Date.now()
    setSkills([...skills, { id: newId, content: newSkill }])
    setNewSkill("")
    setShowSkillModal(false)
  }

  const handleRemoveQualification = (id: number) => {
    if (confirm("この項目を削除しますか？")) {
      setQualifications(qualifications.filter((item) => item.id !== id))
    }
  }

  const handleRemoveSkill = (id: number) => {
    if (confirm("この項目を削除しますか？")) {
      setSkills(skills.filter((item) => item.id !== id))
    }
  }

  const handleNext = () => {
    const existingData = JSON.parse(sessionStorage.getItem("formData") || "{}")
    sessionStorage.setItem(
      "formData",
      JSON.stringify({
        ...existingData,
        step4: { qualifications, skills },
      }),
    )
    router.push("/create-steps/5")
  }

  const handleBack = () => {
    const existingData = JSON.parse(sessionStorage.getItem("formData") || "{}")
    sessionStorage.setItem(
      "formData",
      JSON.stringify({
        ...existingData,
        step4: { qualifications, skills },
      }),
    )
    router.push("/create-steps/3")
  }

  const steps = [
    { number: 1, label: "基本情報", active: false },
    { number: 2, label: "会社情報", active: false },
    { number: 3, label: "職務経歴", active: false },
    { number: 4, label: "スキル等", active: true },
    { number: 5, label: "自己PR", active: false },
    { number: 6, label: "アウトプット", active: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <h1 className="text-xl font-bold text-gray-900">活かせるスキル等の入力</h1>
          <Link href="/">
            <Button variant="outline" size="sm" className="text-blue-600 bg-transparent">
              <Home className="w-4 h-4 mr-1" />
              ホーム
            </Button>
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center min-w-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step.active ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step.number}
                </div>
                <span className="text-xs mt-1 text-center whitespace-nowrap">{step.label}</span>
              </div>
              {index < steps.length - 1 && <div className="w-8 h-px bg-gray-300 mx-2"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-md">
          <CardContent className="space-y-8 p-6">
            {/* Qualifications Section */}
            <div>
              <div className="flex items-center mb-4">
                <span className="text-sm font-medium text-gray-700">▼ 資格・特技を入力してください。</span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">内容</div>
                {qualifications.length === 0 ? (
                  <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-200 rounded-lg mb-4">
                    データなし
                  </div>
                ) : (
                  <div className="space-y-2 mb-4">
                    {qualifications.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900">{item.content}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveQualification(item.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-center">
                  <Button variant="outline" onClick={() => setShowQualificationModal(true)} className="bg-transparent">
                    資格・特技を追加
                  </Button>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <div className="flex items-center mb-4">
                <span className="text-sm font-medium text-gray-700">
                  ▼ 活かせる経験・知識・技術等を入力してください。
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">内容</div>
                {skills.length === 0 ? (
                  <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-200 rounded-lg mb-4">
                    データなし
                  </div>
                ) : (
                  <div className="space-y-2 mb-4">
                    {skills.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900">{item.content}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveSkill(item.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-center">
                  <Button variant="outline" onClick={() => setShowSkillModal(true)} className="bg-transparent">
                    項目を追加
                  </Button>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex space-x-4 pt-6">
              <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                保存して戻る
              </Button>
              <Button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700">
                保存して進む
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Qualification Modal */}
      <Dialog open={showQualificationModal} onOpenChange={setShowQualificationModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>項目の追加</DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowQualificationModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 p-4">
            <div>
              <Label className="text-sm font-medium">内容</Label>
              <Input
                value={newQualification}
                onChange={(e) => setNewQualification(e.target.value)}
                placeholder="自動車運転免許2級"
                className="mt-1"
              />
            </div>

            <Button onClick={handleAddQualification} className="w-full bg-blue-600 hover:bg-blue-700">
              追加
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Skill Modal */}
      <Dialog open={showSkillModal} onOpenChange={setShowSkillModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>項目の追加</DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowSkillModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 p-4">
            <div>
              <Label className="text-sm font-medium">内容</Label>
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="フォークリフト運転技能講習修了"
                className="mt-1"
              />
            </div>

            <Button onClick={handleAddSkill} className="w-full bg-blue-600 hover:bg-blue-700">
              追加
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
