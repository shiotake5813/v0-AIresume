import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Wrench } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* Logo/Icon */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="bg-blue-600 p-4 rounded-full">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <FileText className="w-8 h-8 text-blue-600" />
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">AI履歴書作成</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            製造・物流・建設のお仕事探しに
            <br />
            AIが履歴書を自動で作成します
          </p>
        </div>

        {/* CTA Button */}
        <Button
          asChild
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Link href="/select">はじめる</Link>
        </Button>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 mt-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>3分で履歴書完成</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>スマホで簡単操作</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>PDFでダウンロード可能</span>
          </div>
        </div>
      </div>
    </div>
  )
}
