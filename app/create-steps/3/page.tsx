"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Home, Plus, X, Edit } from "lucide-react"
import Link from "next/link"

interface JobHistory {
  id: number
  companyId: number
  companyName: string
  startYear: string
  startMonth: string
  endYear: string
  endMonth: string
  jobContent: string
}

export default function Step3Page() {
  const router = useRouter()
  const [documentType, setDocumentType] = useState<string>("")
  const [companies, setCompanies] = useState<any[]>([])
  const [jobHistories, setJobHistories] = useState<JobHistory[]>([])
  const [showJobModal, setShowJobModal] = useState(false)
  const [editingJob, setEditingJob] = useState<JobHistory | null>(null)
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null)
  const [newJob, setNewJob] = useState<JobHistory>({
    id: 0,
    companyId: 0,
    companyName: "",
    startYear: "",
    startMonth: "",
    endYear: "",
    endMonth: "",
    jobContent: "",
  })

  // 年の選択肢（1980年から現在年まで）
  const yearOptions = Array.from({ length: new Date().getFullYear() - 1979 }, (_, i) => {
    const year = 1980 + i
    return year.toString()
  })

  // 月の選択肢
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, "0")
    return { value: month, label: `${i + 1}月` }
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

    // 会社情報を読み込み
    if (existingData.step2?.companies) {
      setCompanies(existingData.step2.companies)
    }

    // 職務経歴を読み込み
    if (existingData.step3?.jobHistories) {
      setJobHistories(
        existingData.step3.jobHistories.map((job: any) => ({
          id: job.id || Date.now(),
          companyId: job.companyId || 0,
          companyName: job.companyName || "",
          startYear: job.startYear || "",
          startMonth: job.startMonth || "",
          endYear: job.endYear || "",
          endMonth: job.endMonth || "",
          jobContent: job.jobContent || "",
        })),
      )
    }
  }, [router])

  const handleJobInputChange = (field: string, value: string) => {
    if (editingJob) {
      setEditingJob({ ...editingJob, [field]: value })
    } else {
      setNewJob({ ...newJob, [field]: value })
    }
  }

  const handleCompanySelect = (companyId: string) => {
    const company = companies.find((c) => c.id.toString() === companyId)
    if (company) {
      if (editingJob) {
        setEditingJob({
          ...editingJob,
          companyId: company.id,
          companyName: company.name,
        })
      } else {
        setNewJob({
          ...newJob,
          companyId: company.id,
          companyName: company.name,
        })
      }
    }
  }

  const handleAddJob = () => {
    const jobData = editingJob || newJob

    if (!jobData.companyId || !jobData.startYear || !jobData.startMonth) {
      alert("会社、開始年月を入力してください")
      return
    }

    if (editingJob) {
      // 編集の場合
      setJobHistories(jobHistories.map((j) => (j.id === editingJob.id ? editingJob : j)))
    } else {
      // 新規追加の場合
      const newId = Date.now()
      setJobHistories([...jobHistories, { ...newJob, id: newId }])
    }

    // モーダルを閉じてフォームをリセット
    setShowJobModal(false)
    setEditingJob(null)
    setNewJob({
      id: 0,
      companyId: 0,
      companyName: "",
      startYear: "",
      startMonth: "",
      endYear: "",
      endMonth: "",
      jobContent: "",
    })
  }

  const handleEditJob = (job: JobHistory) => {
    setEditingJob(job)
    setShowJobModal(true)
  }

  const handleDeleteJob = (id: number) => {
    if (confirm("この職務経歴を削除しますか？")) {
      setJobHistories(jobHistories.filter((j) => j.id !== id))
    }
  }

  const handleOpenModal = (companyId?: number) => {
    setEditingJob(null)
    const company = companyId ? companies.find((c) => c.id === companyId) : null
    setNewJob({
      id: 0,
      companyId: company?.id || 0,
      companyName: company?.name || "",
      startYear: "",
      startMonth: "",
      endYear: "",
      endMonth: "",
      jobContent: "",
    })
    setSelectedCompanyId(companyId || null)
    setShowJobModal(true)
  }

  const handleCloseModal = () => {
    setShowJobModal(false)
    setEditingJob(null)
    setSelectedCompanyId(null)
  }

  const handleNext = () => {
    const existingData = JSON.parse(sessionStorage.getItem("formData") || "{}")
    sessionStorage.setItem(
      "formData",
      JSON.stringify({
        ...existingData,
        step3: { jobHistories },
      }),
    )
    router.push("/create-steps/4")
  }

  const handleBack = () => {
    const existingData = JSON.parse(sessionStorage.getItem("formData") || "{}")
    sessionStorage.setItem(
      "formData",
      JSON.stringify({
        ...existingData,
        step3: { jobHistories },
      }),
    )
    router.push("/create-steps/2")
  }

  const getJobHistoriesByCompany = (companyId: number) => {
    return jobHistories.filter((job) => job.companyId === companyId)
  }

  const steps = [
    { number: 1, label: "��本情報", active: false },
    { number: 2, label: "会社情報", active: false },
    { number: 3, label: "職務経歴", active: true },
    { number: 4, label: "スキル等", active: false },
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
          <h1 className="text-xl font-bold text-gray-900">職務経歴の入力（古い順）</h1>
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
            {companies.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p className="mb-4">会社情報が登録されていません</p>
                <Button onClick={() => router.push("/create-steps/2")} className="bg-blue-600 hover:bg-blue-700">
                  会社情報を追加する
                </Button>
              </div>
            ) : (
              companies.map((company) => {
                const companyJobs = getJobHistoriesByCompany(company.id)
                return (
                  <div key={company.id}>
                    {/* Company Section */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          ▼ 「{company.name}」での業務内容を入力してください。
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenModal(company.id)}
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          職務経歴を追加する
                        </Button>
                      </div>

                      {/* Job History Table */}
                      <div className="border rounded-lg bg-white">
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-700">
                          <div>年月</div>
                          <div>内容</div>
                        </div>

                        {companyJobs.length === 0 ? (
                          <div className="text-center text-gray-500 py-8">データなし</div>
                        ) : (
                          <div className="divide-y">
                            {companyJobs.map((job) => (
                              <div key={job.id} className="grid grid-cols-2 gap-4 p-4 hover:bg-gray-50">
                                <div className="text-sm">
                                  {job.startYear}年{job.startMonth}月 〜{" "}
                                  {job.endYear && job.endMonth ? `${job.endYear}年${job.endMonth}月` : "現在"}
                                </div>
                                <div className="flex items-start justify-between">
                                  <div className="text-sm text-gray-700 whitespace-pre-wrap flex-1">
                                    {job.jobContent}
                                  </div>
                                  <div className="flex space-x-1 ml-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleEditJob(job)}>
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteJob(job.id)}>
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}

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

      {/* Job History Modal */}
      <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{editingJob ? "職務経歴の編集" : "職務経歴の追加"}</DialogTitle>
              <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6 p-4">
            {/* Company Selection */}
            <div>
              <Label className="text-sm font-medium">会社名</Label>
              <Select
                value={(editingJob?.companyId || newJob.companyId).toString()}
                onValueChange={handleCompanySelect}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="会社を選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Period */}
            <div>
              <Label className="text-sm font-medium">開始時期</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Select
                  value={editingJob?.startYear || newJob.startYear}
                  onValueChange={(value) => handleJobInputChange("startYear", value)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="年" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm">年</span>
                <Select
                  value={editingJob?.startMonth || newJob.startMonth}
                  onValueChange={(value) => handleJobInputChange("startMonth", value)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="月" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* End Period */}
            <div>
              <Label className="text-sm font-medium">終了時期</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Select
                  value={editingJob?.endYear || newJob.endYear}
                  onValueChange={(value) => handleJobInputChange("endYear", value)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="年" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">現在</SelectItem>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm">年</span>
                <Select
                  value={editingJob?.endMonth || newJob.endMonth}
                  onValueChange={(value) => handleJobInputChange("endMonth", value)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="月" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-gray-500 mt-1">現在も在籍中の場合は「現在」を選択してください</p>
            </div>

            {/* Job Content */}
            <div>
              <Label className="text-sm font-medium">業務内容</Label>
              <Textarea
                value={editingJob?.jobContent || newJob.jobContent}
                onChange={(e) => handleJobInputChange("jobContent", e.target.value)}
                placeholder={`【担当業務】
新商品の市場調査から企画開発まで全プロジェクトリーダーとして担当。

【市場調査業務】
・市場ニーズ分析
・結果の分析

【企画企画業務】
・企画立案・設計

・商品設計
・試作および検証`}
                rows={12}
                className="mt-1 resize-none"
              />
            </div>

            <Button onClick={handleAddJob} className="w-full bg-blue-600 hover:bg-blue-700 mt-6">
              {editingJob ? "更新" : "追加"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
