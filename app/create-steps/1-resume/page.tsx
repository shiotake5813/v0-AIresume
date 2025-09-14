"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Step1Data {
  name: string
  furigana: string
  age: string
  gender: string
  phone: string
  email: string
  address: string
  postalCode: string
  birthDate: string
  documentName: string
  createdDate: string
}

export default function Step1ResumePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Step1Data>({
    name: "",
    furigana: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    postalCode: "",
    birthDate: "",
    documentName: "新しい履歴書",
    createdDate: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    const savedData = sessionStorage.getItem("resumeStep1")
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  const handleInputChange = (field: keyof Step1Data, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveBasicInfo = async () => {
    // 基本情報が入力されている場合のみ保存
    if (formData.name && formData.phone && formData.address) {
      try {
        await fetch("/api/save-basic-info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            furigana: formData.furigana,
            age: formData.age,
            gender: formData.gender,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            postalCode: formData.postalCode,
            birthDate: formData.birthDate,
            documentType: "resume",
          }),
        })
      } catch (error) {
        console.error("基本情報保存エラー:", error)
      }
    }
  }

  const handleNext = async () => {
    sessionStorage.setItem("resumeStep1", JSON.stringify(formData))

    // 基本情報を自動保存
    await saveBasicInfo()

    router.push("/create-steps/2-resume")
  }

  const handleBack = () => {
    sessionStorage.setItem("resumeStep1", JSON.stringify(formData))
    router.push("/select")
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
          <div className="flex-1 bg-gray-200 h-2 rounded-full"></div>
          <div className="flex-1 bg-gray-200 h-2 rounded-full"></div>
          <div className="flex-1 bg-gray-200 h-2 rounded-full"></div>
          <div className="flex-1 bg-gray-200 h-2 rounded-full"></div>
          <div className="flex-1 bg-gray-200 h-2 rounded-full"></div>
          <div className="flex-1 bg-gray-200 h-2 rounded-full"></div>
        </div>
        <p className="text-sm text-gray-600 text-center">ステップ 1/7: 基本情報</p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Document Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">書類情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="documentName">書類名</Label>
              <Input
                id="documentName"
                value={formData.documentName}
                onChange={(e) => handleInputChange("documentName", e.target.value)}
                placeholder="新しい履歴書"
              />
            </div>
            <div>
              <Label htmlFor="createdDate">作成日</Label>
              <Input
                id="createdDate"
                type="date"
                value={formData.createdDate}
                onChange={(e) => handleInputChange("createdDate", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">氏名 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="山田 太郎"
                required
              />
            </div>

            <div>
              <Label htmlFor="furigana">ふりがな</Label>
              <Input
                id="furigana"
                value={formData.furigana}
                onChange={(e) => handleInputChange("furigana", e.target.value)}
                placeholder="やまだ たろう"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">年齢</Label>
                <Input
                  id="age"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="25"
                />
              </div>
              <div>
                <Label htmlFor="gender">性別</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">選択してください</option>
                  <option value="男性">男性</option>
                  <option value="女性">女性</option>
                  <option value="その他">その他</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="birthDate">生年月日</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="phone">電話番号 *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="090-1234-5678"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="example@email.com"
              />
            </div>

            <div>
              <Label htmlFor="postalCode">郵便番号</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                placeholder="123-4567"
              />
            </div>

            <div>
              <Label htmlFor="address">住所 *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="東京都渋谷区..."
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded-lg">
          <p>* 印の項目は必須です。入力された基本情報は自動的に保存されます。</p>
        </div>

        <Button
          onClick={handleNext}
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={!formData.name || !formData.phone || !formData.address}
        >
          次へ
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
