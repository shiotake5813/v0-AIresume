"use client"

import { useEffect } from "react"

const ResultResumePage = ({ results }) => {
  useEffect(() => {
    if (results) {
      const saveCompleteData = async () => {
        const sessionId = sessionStorage.getItem("resumeSessionId")
        if (!sessionId) return

        const allStepsData = {
          step1: JSON.parse(sessionStorage.getItem("resumeStep1") || "{}"),
          step2: JSON.parse(sessionStorage.getItem("resumeStep2") || "{}"),
          step3: JSON.parse(sessionStorage.getItem("resumeStep3") || "{}"),
          step4: JSON.parse(sessionStorage.getItem("resumeStep4") || "{}"),
          step5: JSON.parse(sessionStorage.getItem("resumeStep5") || "{}"),
          step6: JSON.parse(sessionStorage.getItem("resumeStep6") || "{}"),
          step7: JSON.parse(sessionStorage.getItem("resumeStep7") || "{}"),
          generatedContent: results,
        }

        try {
          await fetch("/api/save-user-data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              documentType: "resume",
              userData: allStepsData,
              sessionId,
              completionStatus: "complete",
              lastUpdatedStep: 7,
            }),
          })
        } catch (error) {
          console.error("完了データ保存エラー:", error)
        }
      }

      saveCompleteData()
    }
  }, [results])

  return (
    <div>
      {/* Result display code here */}
      {results && <div>{results}</div>}
    </div>
  )
}

export default ResultResumePage
