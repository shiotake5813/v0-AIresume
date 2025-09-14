"use client"

import { useEffect, useState } from "react"

const ResumePage = () => {
  const [formData, setFormData] = useState({})

  // ページ読み込み時とデータ変更時にユーザーデータを保存
  useEffect(() => {
    const saveUserData = async () => {
      const sessionId =
        sessionStorage.getItem("resumeSessionId") || `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem("resumeSessionId", sessionId)

      const step1Data = JSON.parse(sessionStorage.getItem("resumeStep1") || "{}")

      try {
        await fetch("/api/save-user-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentType: "resume",
            userData: {
              step1: step1Data,
              step2: formData,
            },
            sessionId,
            completionStatus: "partial",
            lastUpdatedStep: 2,
          }),
        })
      } catch (error) {
        console.error("ユーザーデータ保存エラー:", error)
      }
    }

    if (Object.keys(formData).some((key) => formData[key as keyof typeof formData] !== "")) {
      saveUserData()
    }
  }, [formData])

  // /** rest of code here **/

  return <div>{/* Resume form components go here */}</div>
}

export default ResumePage
