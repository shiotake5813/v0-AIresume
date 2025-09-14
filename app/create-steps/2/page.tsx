"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Home, ArrowRight, Plus, X, Edit } from "lucide-react"
import Link from "next/link"

interface Company {
  id: number
  name: string
  businessContent: string
  establishedYear: string
  employeeCount: string
  capital: string
  sales: string
  salesYear: string
}

export default function Step2Page() {
  const router = useRouter()
  const [documentType, setDocumentType] = useState<string>("")
  const [companies, setCompanies] = useState<Company[]>([])
  const [showCompanyModal, setShowCompanyModal] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [newCompany, setNewCompany] = useState<Company>({
    id: 0,
    name: "",
    businessContent: "",
    establishedYear: "",
    employeeCount: "",
    capital: "",
    sales: "",
    salesYear: "",
  })

  useEffect(() => {
    const type = sessionStorage.getItem("documentType")

    if (!type) {
      router.push("/select")
      return
    }

    setDocumentType(type)

    // 既存データを読み込み
    const existingData = JSON.parse(sessionStorage.getItem("formData") || "{}")
    if (existingData.step2?.companies) {
      setCompanies(
        existingData.step2.companies.map((company: any) => ({
          id: company.id || Date.now(),
          name: company.name || "",
          businessContent: company.businessContent || "",
          establishedYear: company.establishedYear || "",
          employeeCount: company.employeeCount || "",
          capital: company.capital || "",
          sales: company.sales || "",
          salesYear: company.salesYear || "",
        })),
      )
    }
  }, [router])

  const handleCompanyInputChange = (field: string, value: string) => {
    if (editingCompany) {
      setEditingCompany({ ...editingCompany, [field]: value })
    } else {
      setNewCompany({ ...newCompany, [field]: value })
    }
  }

  const handleAddCompany = () => {
    const companyData = editingCompany || newCompany

    if (!companyData.name.trim()) {
      alert("会社名を入力してください")
      return
    }

    if (editingCompany) {
      // 編集の場合
      setCompanies(companies.map((c) => (c.id === editingCompany.id ? editingCompany : c)))
    } else {
      // 新規追加の場合
      const newId = Date.now()
      setCompanies([...companies, { ...newCompany, id: newId }])
    }

    // モーダルを閉じてフォームをリセット
    setShowCompanyModal(false)
    setEditingCompany(null)
    setNewCompany({
      id: 0,
      name: "",
      businessContent: "",
      establishedYear: "",
      employeeCount: "",
      capital: "",
      sales: "",
      salesYear: "",
    })
  }

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company)
    setShowCompanyModal(true)
  }

  const handleDeleteCompany = (id: number) => {
    if (confirm("この会社情報を削除しますか？")) {
      setCompanies(companies.filter((c) => c.id !== id))
    }
  }

  const handleOpenModal = () => {
    setEditingCompany(null)
    setNewCompany({
      id: 0,
      name: "",
      businessContent: "",
      establishedYear: "",
      employeeCount: "",
      capital: "",
      sales: "",
      salesYear: "",
    })
    setShowCompanyModal(true)
  }

  const handleCloseModal = () => {
    setShowCompanyModal(false)
    setEditingCompany(null)
  }

  const handleNext = () => {
    const existingData = JSON.parse(sessionStorage.getItem("formData") || "{}")
    sessionStorage.setItem(
      "formData",
      JSON.stringify({
        ...existingData,
        step2: { companies },
      }),
    )
    router.push("/create-steps/3")
  }

  const handleBack = () => {
    const existingData = JSON.parse(sessionStorage.getItem("formData") || "{}")
    sessionStorage.setItem(
      "formData",
      JSON.stringify({
        ...existingData,
        step2: { companies },
      }),
    )
    router.push("/create-steps/1")
  }

  const steps = [
    { number: 1, label: "基本情報", active: false },
    { number: 2, label: documentType === "career" ? "会社情報" : "詳細情報", active: true },
    { number: 3, label: documentType === "career" ? "職務経歴" : "学歴・職歴", active: false },
    { number: 4, label: documentType === "career" ? "スキル等" : "免許・資格", active: false },
    { number: 5, label: "自己PR", active: false },
    { number: 6, label: documentType === "career" ? "アウトプット" : "その他", active: false },
    { number: 7, label: "アウトプット", active: false },
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
          <h1 className="text-xl font-bold text-gray-900">会社情報</h1>
          <Link href="/">
            <Button variant="outline" size="sm" className="text-blue-600 bg-transparent">
              <Home className="w-4 h-4 mr-1" />
              ホーム
            </Button>
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto">
          {steps.slice(0, documentType === "resume" ? 7 : 6).map((step, index) => (
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
              {index < (documentType === "resume" ? 6 : 5) && <div className="w-8 h-px bg-gray-300 mx-2"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">会社情報</CardTitle>
              <Button variant="outline" size="sm" onClick={handleOpenModal}>
                <Plus className="w-4 h-4 mr-1" />
                会社を追加
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">▼ 在籍していた会社をすべて入力してください。</p>
            </div>

            {/* Company List */}
            {companies.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p className="mb-4">会社情報が登録されていません</p>
                <Button onClick={handleOpenModal} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  最初の会社を追加
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {companies.map((company, index) => (
                  <div key={company.id} className="p-4 border rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">会社 {index + 1}</h3>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditCompany(company)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCompany(company.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">会社名:</span>
                        <div className="text-gray-900">{company.name}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">事業内容:</span>
                        <div className="text-gray-900">{company.businessContent || "未入力"}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">設立年:</span>
                        <div className="text-gray-900">
                          {company.establishedYear ? `${company.establishedYear}年` : "未入力"}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">従業員数:</span>
                        <div className="text-gray-900">
                          {company.employeeCount ? `${company.employeeCount}人` : "未入力"}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">資本金:</span>
                        <div className="text-gray-900">{company.capital ? `${company.capital}円` : "未入力"}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">売上高:</span>
                        <div className="text-gray-900">
                          {company.sales ? `${company.sales}円 (${company.salesYear}年度)` : "未入力"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex space-x-4 pt-6">
              <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                前に戻る
              </Button>
              <Button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700">
                次に進む
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Modal */}
      <Dialog open={showCompanyModal} onOpenChange={setShowCompanyModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{editingCompany ? "会社情報の編集" : "会社情報の追加"}</DialogTitle>
              <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 p-4">
            {/* 会社名 */}
            <div>
              <Label className="text-sm font-medium">
                会社名 <span className="text-red-500">*</span>
              </Label>
              <Input
                value={editingCompany?.name || newCompany.name}
                onChange={(e) => handleCompanyInputChange("name", e.target.value)}
                placeholder="株式会社XXX"
                className="mt-1"
              />
            </div>

            {/* 事業内容 */}
            <div>
              <Label className="text-sm font-medium">事業内容</Label>
              <Input
                value={editingCompany?.businessContent || newCompany.businessContent}
                onChange={(e) => handleCompanyInputChange("businessContent", e.target.value)}
                placeholder="食材の製造・販売"
                className="mt-1"
              />
            </div>

            {/* 設立年 */}
            <div>
              <Label className="text-sm font-medium">設立年</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  type="number"
                  value={editingCompany?.establishedYear || newCompany.establishedYear}
                  onChange={(e) => handleCompanyInputChange("establishedYear", e.target.value)}
                  placeholder="2000"
                  className="flex-1"
                />
                <span className="text-sm text-gray-600">年</span>
              </div>
            </div>

            {/* 従業員数 */}
            <div>
              <Label className="text-sm font-medium">従業員数</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  type="number"
                  value={editingCompany?.employeeCount || newCompany.employeeCount}
                  onChange={(e) => handleCompanyInputChange("employeeCount", e.target.value)}
                  placeholder="100"
                  className="flex-1"
                />
                <span className="text-sm text-gray-600">人</span>
              </div>
            </div>

            {/* 資本金 */}
            <div>
              <Label className="text-sm font-medium">資本金</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  type="number"
                  value={editingCompany?.capital || newCompany.capital}
                  onChange={(e) => handleCompanyInputChange("capital", e.target.value)}
                  placeholder="1000000"
                  className="flex-1"
                />
                <span className="text-sm text-gray-600">円</span>
              </div>
            </div>

            {/* 売上高 */}
            <div>
              <Label className="text-sm font-medium">売上高</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  type="number"
                  value={editingCompany?.sales || newCompany.sales}
                  onChange={(e) => handleCompanyInputChange("sales", e.target.value)}
                  placeholder="10000000"
                  className="flex-1"
                />
                <span className="text-sm text-gray-600">円</span>
              </div>
            </div>

            {/* 売上高の年度 */}
            <div>
              <Label className="text-sm font-medium">売上高の年度</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  type="number"
                  value={editingCompany?.salesYear || newCompany.salesYear}
                  onChange={(e) => handleCompanyInputChange("salesYear", e.target.value)}
                  placeholder="2000"
                  className="flex-1"
                />
                <span className="text-sm text-gray-600">年度</span>
              </div>
            </div>

            <Button onClick={handleAddCompany} className="w-full bg-blue-600 hover:bg-blue-700 mt-6">
              {editingCompany ? "更新" : "追加"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
