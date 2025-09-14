"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Mail } from "lucide-react"

export default function PreviewPage() {
  const [formData, setFormData] = useState({
    documentName: "新しい書類",
    createdDate: {
      year: "2025",
      month: "7",
      day: "10",
    },
    name: "伊藤",
    nameKana: "いとう",
    birthDate: {
      year: "2000",
      month: "05",
      day: "26",
    },
    age: "25",
    gender: "男",
    phone: "090-7546-2322",
    email: "itou.sample@gmail.com",
    postalCode: "123-4567",
    address: "東京都渋谷区○○町1-2-3",
    addressKana: "とうきょうとしぶやく○○ちょう",
    educationHistory: [
      { year: "2024", month: "4", content: "明治大学" },
      { year: "2025", month: "4", content: "株式会社markdoor" },
    ],
    selfPR:
      "私は大学時代の部活動経験を通じて、チームワークの重要性を学びました。特に困難な状況でも諦めずに取り組む姿勢を身につけ、目標達成に向けて継続的に努力することができます。また、新しい技術や知識の習得にも積極的で、常に成長を心がけています。これらの経験を活かし、貴社の発展に貢献したいと考えております。",
    personalRequest: "貴社規定に従います。",
  })

  const previewRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleDownload = () => {
    console.log("PDFダウンロード")
  }

  const handleEmailSend = () => {
    console.log("メール送信")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6" />
            <h1 className="text-xl font-bold">AIレジュメネオ</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="text-blue-600 bg-white hover:bg-gray-100">
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Form */}
        <div className="w-1/3 bg-white p-6 overflow-y-auto border-r">
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-lg font-semibold">内容の編集</CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              {/* Document Name */}
              <div>
                <Label className="text-sm font-medium">書類名</Label>
                <Input
                  value={formData.documentName}
                  onChange={(e) => handleInputChange("documentName", e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Creation Date */}
              <div>
                <Label className="text-sm font-medium">作成日（書類に記載される日付）</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    type="number"
                    value={formData.createdDate.year}
                    onChange={(e) => handleInputChange("createdDate.year", e.target.value)}
                    className="w-20"
                  />
                  <span className="text-sm">年</span>
                  <Input
                    type="number"
                    value={formData.createdDate.month}
                    onChange={(e) => handleInputChange("createdDate.month", e.target.value)}
                    className="w-16"
                  />
                  <span className="text-sm">月</span>
                  <Input
                    type="number"
                    value={formData.createdDate.day}
                    onChange={(e) => handleInputChange("createdDate.day", e.target.value)}
                    className="w-16"
                  />
                  <span className="text-sm">日</span>
                </div>
              </div>

              {/* Name */}
              <div>
                <Label className="text-sm font-medium">氏名</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Name Kana */}
              <div>
                <Label className="text-sm font-medium">氏名（ふりがな）</Label>
                <Input
                  value={formData.nameKana}
                  onChange={(e) => handleInputChange("nameKana", e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Birth Date */}
              <div>
                <Label className="text-sm font-medium">生年月日</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    type="number"
                    value={formData.birthDate.year}
                    onChange={(e) => handleInputChange("birthDate.year", e.target.value)}
                    className="w-20"
                  />
                  <span className="text-sm">年</span>
                  <Input
                    type="number"
                    value={formData.birthDate.month}
                    onChange={(e) => handleInputChange("birthDate.month", e.target.value)}
                    className="w-16"
                  />
                  <span className="text-sm">月</span>
                  <Input
                    type="number"
                    value={formData.birthDate.day}
                    onChange={(e) => handleInputChange("birthDate.day", e.target.value)}
                    className="w-16"
                  />
                  <span className="text-sm">日</span>
                </div>
              </div>

              {/* Age */}
              <div>
                <Label className="text-sm font-medium">年齢</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="w-20"
                  />
                  <span className="text-sm">歳</span>
                </div>
              </div>

              {/* Gender */}
              <div>
                <Label className="text-sm font-medium">性別</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="男">男</SelectItem>
                    <SelectItem value="女">女</SelectItem>
                    <SelectItem value="不明">不明</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - PDF Preview */}
        <div className="flex-1 bg-gray-200 p-6 overflow-y-auto">
          <div className="flex justify-end space-x-3 mb-4">
            <Button variant="outline" onClick={handleEmailSend} className="bg-white">
              <Mail className="w-4 h-4 mr-2" />
              自分宛にメール送信
            </Button>
            <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              ダウンロード
            </Button>
          </div>

          {/* PDF Preview Container */}
          <div className="bg-white shadow-lg mx-auto" style={{ width: "595px", minHeight: "842px" }}>
            <div
              ref={previewRef}
              className="p-12"
              style={{
                fontFamily: "'MS Gothic', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', monospace",
                fontSize: "11px",
                lineHeight: "1.4",
                color: "#000",
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-2xl font-bold mb-4" style={{ fontSize: "20px", letterSpacing: "6px" }}>
                    履歴書
                  </h1>
                </div>
                <div className="text-right text-sm">
                  {formData.createdDate.year}年{formData.createdDate.month}月{formData.createdDate.day}日現在
                </div>
              </div>

              {/* Personal Information Section */}
              <table className="w-full border-2 border-black mb-6" style={{ borderCollapse: "collapse" }}>
                <tbody>
                  {/* Name Row */}
                  <tr>
                    <td
                      className="border border-black p-2 text-center font-bold bg-gray-100"
                      style={{ width: "70px", fontSize: "10px" }}
                    >
                      ふりがな
                    </td>
                    <td className="border border-black p-2" style={{ width: "180px" }}>
                      {formData.nameKana}
                    </td>
                    <td rowSpan={5} className="border border-black p-2 text-center align-top" style={{ width: "90px" }}>
                      <div
                        className="border border-gray-400 mx-auto flex items-center justify-center text-xs text-gray-500"
                        style={{ width: "70px", height: "90px" }}
                      >
                        写真を貼る位置
                        <br />
                        (縦4cm×横3cm)
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 text-center font-bold bg-gray-100">氏名</td>
                    <td className="border border-black p-2 text-lg font-bold" style={{ fontSize: "14px" }}>
                      {formData.name}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 text-center font-bold bg-gray-100">生年月日</td>
                    <td className="border border-black p-2">
                      {formData.birthDate.year}年{formData.birthDate.month}月{formData.birthDate.day}日生（満
                      {formData.age}歳）
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 text-center font-bold bg-gray-100">性別</td>
                    <td className="border border-black p-2">{formData.gender}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 text-center font-bold bg-gray-100">電話</td>
                    <td className="border border-black p-2">{formData.phone}</td>
                  </tr>
                </tbody>
              </table>

              {/* Address Section */}
              <table className="w-full border-2 border-black mb-6" style={{ borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td className="border border-black p-2 text-center font-bold bg-gray-100" style={{ width: "70px" }}>
                      ふりがな
                    </td>
                    <td className="border border-black p-2">{formData.addressKana}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 text-center font-bold bg-gray-100">現住所</td>
                    <td className="border border-black p-2">
                      〒{formData.postalCode}
                      <br />
                      {formData.address}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 text-center font-bold bg-gray-100">E-mail</td>
                    <td className="border border-black p-2">{formData.email}</td>
                  </tr>
                </tbody>
              </table>

              {/* Education and Work History */}
              <table className="w-full border-2 border-black mb-6" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      colSpan={3}
                      className="border border-black p-2 text-center font-bold bg-gray-100"
                      style={{ fontSize: "12px" }}
                    >
                      学歴・職歴（各別にまとめて書く）
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-black p-2 text-center font-bold bg-gray-50" style={{ width: "50px" }}>
                      年
                    </th>
                    <th className="border border-black p-2 text-center font-bold bg-gray-50" style={{ width: "30px" }}>
                      月
                    </th>
                    <th className="border border-black p-2 text-center font-bold bg-gray-50">学歴・職歴</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-2 text-center" style={{ height: "25px" }}></td>
                    <td className="border border-black p-2 text-center"></td>
                    <td className="border border-black p-2 font-bold text-center">【学歴】</td>
                  </tr>
                  {formData.educationHistory.slice(0, 1).map((item, index) => (
                    <tr key={index}>
                      <td className="border border-black p-2 text-center" style={{ height: "25px" }}>
                        {item.year}
                      </td>
                      <td className="border border-black p-2 text-center">{item.month}</td>
                      <td className="border border-black p-2">{item.content}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="border border-black p-2 text-center" style={{ height: "25px" }}></td>
                    <td className="border border-black p-2 text-center"></td>
                    <td className="border border-black p-2 font-bold text-center">【職歴】</td>
                  </tr>
                  {formData.educationHistory.slice(1).map((item, index) => (
                    <tr key={index}>
                      <td className="border border-black p-2 text-center" style={{ height: "25px" }}>
                        {item.year}
                      </td>
                      <td className="border border-black p-2 text-center">{item.month}</td>
                      <td className="border border-black p-2">{item.content}</td>
                    </tr>
                  ))}
                  {/* Empty rows */}
                  {Array.from({ length: 6 }).map((_, index) => (
                    <tr key={`empty-${index}`}>
                      <td className="border border-black p-2" style={{ height: "25px" }}></td>
                      <td className="border border-black p-2"></td>
                      <td className="border border-black p-2"></td>
                    </tr>
                  ))}
                  <tr>
                    <td className="border border-black p-2 text-center" style={{ height: "25px" }}></td>
                    <td className="border border-black p-2 text-center"></td>
                    <td className="border border-black p-2 text-right">以上</td>
                  </tr>
                </tbody>
              </table>

              {/* Licenses and Qualifications */}
              <table className="w-full border-2 border-black mb-6" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      colSpan={3}
                      className="border border-black p-2 text-center font-bold bg-gray-100"
                      style={{ fontSize: "12px" }}
                    >
                      免許・資格
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-black p-2 text-center font-bold bg-gray-50" style={{ width: "50px" }}>
                      年
                    </th>
                    <th className="border border-black p-2 text-center font-bold bg-gray-50" style={{ width: "30px" }}>
                      月
                    </th>
                    <th className="border border-black p-2 text-center font-bold bg-gray-50">資格・免許</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-2 text-center" style={{ height: "25px" }}></td>
                    <td className="border border-black p-2 text-center"></td>
                    <td className="border border-black p-2 text-center">特になし</td>
                  </tr>
                  {/* Empty rows */}
                  {Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`empty-license-${index}`}>
                      <td className="border border-black p-2" style={{ height: "25px" }}></td>
                      <td className="border border-black p-2"></td>
                      <td className="border border-black p-2"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Second Page */}
            <div
              className="p-12 border-t-2 border-dashed border-gray-300"
              style={{
                fontFamily: "'MS Gothic', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', monospace",
                fontSize: "11px",
                lineHeight: "1.4",
                color: "#000",
              }}
            >
              {/* Self-PR Section */}
              <table className="w-full border-2 border-black mb-6" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      className="border border-black p-2 text-center font-bold bg-gray-100"
                      style={{ fontSize: "11px" }}
                    >
                      志望の動機、特技、好きな学科、アピールポイントなど
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-4" style={{ height: "200px", verticalAlign: "top" }}>
                      <div className="whitespace-pre-wrap leading-relaxed" style={{ fontSize: "10px" }}>
                        {formData.selfPR}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Personal Request Section */}
              <table className="w-full border-2 border-black" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      className="border border-black p-2 font-bold bg-gray-100"
                      style={{ width: "100px", fontSize: "10px" }}
                    >
                      本人希望記入欄
                    </th>
                    <th
                      className="border border-black p-2 text-right font-normal bg-gray-100"
                      style={{ fontSize: "8px" }}
                    >
                      （特に給料・職種・勤務時間・勤務地・その他についての希望があれば記入）
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      colSpan={2}
                      className="border border-black p-4"
                      style={{ height: "100px", verticalAlign: "top" }}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed" style={{ fontSize: "10px" }}>
                        {formData.personalRequest}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
