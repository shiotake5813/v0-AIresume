import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">履歴書・職務経歴書作成</h3>
            <p className="text-gray-600 text-sm">
              AIを活用した履歴書・職務経歴書作成サービス。 プロフェッショナルな書類を簡単に作成できます。
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">サービス</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/select" className="text-gray-600 hover:text-blue-600">
                  履歴書作成
                </Link>
              </li>
              <li>
                <Link href="/select" className="text-gray-600 hover:text-blue-600">
                  職務経歴書作成
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                  ダッシュボード
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">サポート</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-600 hover:text-blue-600">
                  ヘルプ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-blue-600">
                  よくある質問
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">法的情報</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-600">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">© 2024 履歴書・職務経歴書作成サービス. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
