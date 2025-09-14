"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Qualification {
  name: string
  date: string
}

interface Skill {
  name: string
  level: string
}

export default function Step5Page() {
  const router = useRouter()
  const [qualifications, setQualifications] = useState<Qualification[]>([{ name: "", date: "" }])
  const [skills, setSkills] = useState<Skill[]>([{ name: "", level: "" }])
  const [selfPR, setSelfPR] = useState("")
  const [motivation, setMotivation] = useState("")

  useEffect(() => {
    // Load existing data from sessionStorage
    const savedData = sessionStorage.getItem("formData")
    if (savedData) {
      const formData = JSON.parse(savedData)
      if (formData.step5) {
        setQualifications(formData.step5.qualifications || [{ name: "", date: "" }])
        setSkills(formData.step5.skills || [{ name: "", level: "" }])
        setSelfPR(formData.step5.selfPR || "")
        setMotivation(formData.step5.motivation || "")
      }
    }
  }, [])

  const addQualification = () => {
    setQualifications([...qualifications, { name: "", date: "" }])
  }

  const removeQualification = (index: number) => {
    if (qualifications.length > 1) {
      setQualifications(qualifications.filter((_, i) => i !== index))
    }
  }

  const updateQualification = (index: number, field: keyof Qualification, value: string) => {
    const updated = qualifications.map((qual, i) => (i === index ? { ...qual, [field]: value } : qual))
    setQualifications(updated)
  }

  const addSkill = () => {
    setSkills([...skills, { name: "", level: "" }])
  }

  const removeSkill = (index: number) => {
    if (skills.length > 1) {
      setSkills(skills.filter((_, i) => i !== index))
    }
  }

  const updateSkill = (index: number, field: keyof Skill, value: string) => {
    const updated = skills.map((skill, i) => (i === index ? { ...skill, [field]: value } : skill))
    setSkills(updated)
  }

  const handleNext = () => {
    // Save current step data
    const savedData = sessionStorage.getItem("formData")
    const formData = savedData ? JSON.parse(savedData) : {}

    formData.step5 = {
      qualifications: qualifications.filter((q) => q.name.trim() !== ""),
      skills: skills.filter((s) => s.name.trim() !== ""),
      selfPR,
      motivation,
    }

    sessionStorage.setItem("formData", JSON.stringify(formData))
    router.push("/create")
  }

  const handleBack = () => {
    // Save current step data before going back
    const savedData = sessionStorage.getItem("formData")
    const formData = savedData ? JSON.parse(savedData) : {}

    formData.step5 = {
      qualifications: qualifications.filter((q) => q.name.trim() !== ""),
      skills: skills.filter((s) => s.name.trim() !== ""),
      selfPR,
      motivation,
    }

    sessionStorage.setItem("formData", JSON.stringify(formData))
    router.push("/create-steps/4")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>ステップ 5/5</span>
            <span>資格・スキル・自己PR</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>資格・スキル・自己PR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Qualifications */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-medium">資格・免許</Label>
                <Button type="button" variant="outline" size="sm" onClick={addQualification}>
                  <Plus className="w-4 h-4 mr-2" />
                  追加
                </Button>
              </div>
              <div className="space-y-4">
                {qualifications.map((qualification, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label htmlFor={`qualification-name-${index}`}>資格名</Label>
                      <Input
                        id={`qualification-name-${index}`}
                        value={qualification.name}
                        onChange={(e) => updateQualification(index, "name", e.target.value)}
                        placeholder="例: 普通自動車第一種運転免許"
                      />
                    </div>
                    <div className="w-32">
                      <Label htmlFor={`qualification-date-${index}`}>取得年月</Label>
                      <Input
                        id={`qualification-date-${index}`}
                        type="month"
                        value={qualification.date}
                        onChange={(e) => updateQualification(index, "date", e.target.value)}
                      />
                    </div>
                    {qualifications.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeQualification(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-medium">スキル・技術</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                  <Plus className="w-4 h-4 mr-2" />
                  追加
                </Button>
              </div>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label htmlFor={`skill-name-${index}`}>スキル名</Label>
                      <Input
                        id={`skill-name-${index}`}
                        value={skill.name}
                        onChange={(e) => updateSkill(index, "name", e.target.value)}
                        placeholder="例: Microsoft Excel"
                      />
                    </div>
                    <div className="w-32">
                      <Label htmlFor={`skill-level-${index}`}>レベル</Label>
                      <select
                        id={`skill-level-${index}`}
                        value={skill.level}
                        onChange={(e) => updateSkill(index, "level", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">選択</option>
                        <option value="初級">初級</option>
                        <option value="中級">中級</option>
                        <option value="上級">上級</option>
                        <option value="エキスパート">エキスパート</option>
                      </select>
                    </div>
                    {skills.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSkill(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Self PR */}
            <div>
              <Label htmlFor="selfPR" className="text-base font-medium">
                自己PR
              </Label>
              <Textarea
                id="selfPR"
                value={selfPR}
                onChange={(e) => setSelfPR(e.target.value)}
                placeholder="あなたの強みや特技、アピールポイントを記入してください"
                rows={6}
                className="mt-2"
              />
            </div>

            {/* Motivation */}
            <div>
              <Label htmlFor="motivation" className="text-base font-medium">
                志望動機
              </Label>
              <Textarea
                id="motivation"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="なぜこの職種・会社を志望するのか記入してください"
                rows={6}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            前へ
          </Button>
          <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
            履歴書を生成
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
