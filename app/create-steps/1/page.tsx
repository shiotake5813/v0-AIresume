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
}

export default function Step1Page() {
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
  })
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const savedData = sessionStorage.getItem("resumeStep1")
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData))
      } catch (error) {
        console.error("保存データの読み込みエラー:", error)
      }
    }
  }, [])

  const handleInputChange = (field: keyof Step1Data, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveBasicInfo = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      return
    }

    setSaveStatus("saving")
    setErrorMessage("")

    try {
      console.log("基本情報保存開始:", formData)

      const response = await fetch("/api/save-basic-info", {
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
        }),
      })

      console.log("レスポンス状態:", response.status)
      console.log("レスポンスヘッダー:", response.headers.get("content-type"))

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("レスポンス結果:", result)

      if (result.success) {
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 2000)
      } else {
        setSaveStatus("error")
        setErrorMessage(result.message || "保存に失敗しました")
        setTimeout(() => {
          setSaveStatus("idle")
          setErrorMessage("")
        }, 5000)
      }
    } catch (error: any) {
      console.error("基本情報保存エラー:", error)
      setSaveStatus("error")
      setErrorMessage(error.message || "ネットワークエラーが発生しました")
      setTimeout(() => {
        setSaveStatus("idle")
        setErrorMessage("")
      }, 5000)
    }
  }

  const handleNext = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert("必須項目を入力してください（名前、電話番号、住所）")
      return
    }

    // セッションストレージに保存
    sessionStorage.setItem("resumeStep1", JSON.stringify(formData))

    // 基本情報を自動保存
    await saveBasicInfo()

    // 次のステップに進む
    router.push("/create-steps/2")
  }

  const handleBack = () => {
    sessionStorage.setItem("resumeStep1", JSON.stringify(formData))
    router.push("/")
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

      {/* Save Status */}
      {saveStatus !== "idle" && (
        <div className="max-w-md mx-auto mb-4">
          {saveStatus === "saving" && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded text-sm">保存中...</div>
          )}
          {saveStatus === "saved" && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
              基本情報が自動保存されました
            </div>
          )}
          {saveStatus === "error" && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
              保存に失敗しました: {errorMessage}
            </div>
          )}
        </div>
      )}

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">基本情報</CardTitle>
            <p className="text-sm text-gray-600">履歴書に記載する基本的な個人情報を入力してください</p>
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

        <div className="mt-6 text-xs text-gray-500 bg-gray-100 p-3 rounded-lg">
          <p>* 印の項目は必須です。入力された基本情報は自動的に保存されます。</p>
        </div>

        <Button
          onClick={handleNext}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
          disabled={!formData.name || !formData.phone || !formData.address}
        >
          次へ
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
