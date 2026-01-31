"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Progress } from "../../components/ui/progress"
import { QuestionCard } from "./question-card"
import { ResultsDisplay } from "./results-display"
import {
  personalGrowthTest,
  calculateDiagnosticResult,
  saveDiagnosticResult,
  type DiagnosticAnswer,
  type DiagnosticResult,
} from "../../lib/diagnostic"
import { useAuth } from "../../hooks/use-auth"
import { useToast } from "../../hooks/use-toast"
import { ArrowLeft, ArrowRight, Clock, Target, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

type TestState = "intro" | "taking" | "processing" | "results"

export function DiagnosticTest() {
  const t = useTranslations("diagnostic_test");
  const [state, setState] = useState<TestState>("intro")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<DiagnosticAnswer[]>([])
  const [result, setResult] = useState<DiagnosticResult | null>(null)
  const { user }:any = useAuth()
  const { toast } = useToast()

  const currentQuestion = personalGrowthTest.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / personalGrowthTest.questions.length) * 100
  const isLastQuestion = currentQuestionIndex === personalGrowthTest.questions.length - 1

  const getCurrentAnswer = () => {
    return answers.find((a) => a.questionId === currentQuestion?.id)?.value
  }

  const handleAnswer = (value: string | number | boolean) => {
    const newAnswer: DiagnosticAnswer = {
      questionId: currentQuestion.id,
      value,
      timestamp: new Date(),
    }

    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== currentQuestion.id)
      return [...filtered, newAnswer]
    })
  }

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmitTest()
    } else {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSubmitTest = async () => {
    if (!user) {
      toast({
        title: t("toast_auth_required_title"),
        description: t("toast_auth_required_description"),
        variant: "destructive",
      })
      return
    }

    setState("processing")

    try {
      const testResult = await calculateDiagnosticResult(user.id, personalGrowthTest.id, answers)

      await saveDiagnosticResult(testResult)
      setResult(testResult)
      setState("results")

      toast({
        title: t("toast_complete_title"),
        description: t("toast_complete_description"),
      })
    } catch (error) {
      toast({
        title: t("toast_processing_failed_title"),
        description: t("toast_processing_failed_description"),
        variant: "destructive",
      })
      setState("taking")
    }
  }

  const handleRetakeTest = () => {
    setCurrentQuestionIndex(0)
    setAnswers([])
    setResult(null)
    setState("intro")
  }

  const handleStartTest = () => {
    setState("taking")
  }

  if (state === "intro") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{personalGrowthTest.title}</CardTitle>
            <CardDescription className="text-base">{personalGrowthTest.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{t("duration_label")}</div>
                  <div className="text-sm text-muted-foreground">{personalGrowthTest.estimatedTime}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{t("questions_label")}</div>
                  <div className="text-sm text-muted-foreground">{t("questions_count", { count: personalGrowthTest.questions.length })}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">{t("discover_title")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>{t("strength_point")}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>{t("potential_point")}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>{t("ai_plan_point")}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>{t("resources_point")}</span>
                </li>
              </ul>
            </div>

            <Button onClick={handleStartTest} className="w-full" size="lg">
              {t("start_button")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (state === "processing") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <h3 className="text-lg font-medium">{t("processing_title")}</h3>
            <p className="text-muted-foreground text-center">
              {t("processing_description")}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (state === "results" && result) {
    return (
      <div className="max-w-4xl mx-auto">
        <ResultsDisplay result={result} onRetakeTest={handleRetakeTest} />
      </div>
    )
  }

  // Taking test state
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {t("question_progress", { current: currentQuestionIndex + 1, total: personalGrowthTest.questions.length })}
          </span>
          <span>{t("progress_complete", { progress: Math.round(progress) })}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <QuestionCard
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={personalGrowthTest.questions.length}
        value={getCurrentAnswer()}
        onAnswer={handleAnswer}
      />

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("previous_button")}
        </Button>

        <Button onClick={handleNext} disabled={getCurrentAnswer() === undefined}>
          {isLastQuestion ? t("complete_button") : t("next_button")}
          {!isLastQuestion && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}