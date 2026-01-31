"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import type { DiagnosticQuestion } from "../../lib/diagnostic"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { useEffect, useState } from "react"

interface QuestionCardProps {
  question: DiagnosticQuestion
  questionNumber: number
  totalQuestions: number
  value: string | number | boolean | undefined
  onAnswer: (value: string | number | boolean) => void
}

export function QuestionCard({ question, questionNumber, totalQuestions, value, onAnswer }: QuestionCardProps) {
  const t = useTranslations("question_card");
  const t_data = useTranslations("diagnostic_data"); // For category names
  const locale = useLocale();
  const [translatedCategoryName, setTranslatedCategoryName] = useState("");

  useEffect(() => {
    const categoryMap: Record<string, string> = {
      "emotional": t_data("category_emotional"),
      "social": t_data("category_social"),
      "career": t_data("category_career"),
      "health": t_data("category_health"),
      "mindfulness": t_data("category_mindfulness"),
      "relationships": t_data("category_relationships"),
    };
    setTranslatedCategoryName(categoryMap[question.category] || question.category);
  }, [question.category, locale, t_data]);


  const getCategoryColor = (category: string) => {
    switch (category) {
      case "emotional":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "social":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "career":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "health":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "mindfulness":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "relationships":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const renderScaleQuestion = () => {
    if (!question.scaleMin || !question.scaleMax) return null

    const options = []
    for (let i = question.scaleMin; i <= question.scaleMax; i++) {
      options.push(i)
    }

    return (
      <div className="space-y-4">
        <RadioGroup
          value={value?.toString()}
          onValueChange={(val) => onAnswer(Number.parseInt(val))}
          className="grid grid-cols-5 gap-4"
        >
          {options.map((option) => (
            <div key={option} className="flex flex-col items-center space-y-2">
              <RadioGroupItem value={option.toString()} id={`${question.id}-${option}`} className="w-6 h-6" />
              <Label htmlFor={`${question.id}-${option}`} className="text-sm font-medium cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {question.scaleLabels && (
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{question.scaleLabels.min}</span>
            <span>{question.scaleLabels.max}</span>
          </div>
        )}
      </div>
    )
  }

  const renderMultipleChoice = () => {
    if (!question.options) return null

    return (
      <RadioGroup value={value?.toString()} onValueChange={(val) => onAnswer(val)} className="space-y-3">
        {question.options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`${question.id}-${index}`} />
            <Label htmlFor={`${question.id}-${index}`} className="cursor-pointer flex-1">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    )
  }

  const renderBooleanQuestion = () => {
    return (
      <div className="flex space-x-4">
        <Button variant={value === true ? "default" : "outline"} onClick={() => onAnswer(true)} className="flex-1">
          {t("yes_button")}
        </Button>
        <Button variant={value === false ? "default" : "outline"} onClick={() => onAnswer(false)} className="flex-1">
          {t("no_button")}
        </Button>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(question.category)}`}>
            {translatedCategoryName}
          </span>
          <span className="text-sm text-muted-foreground">
            {t("question_progress", { current: questionNumber, total: totalQuestions })}
          </span>
        </div>
        <CardTitle className="text-lg leading-relaxed">{question.text}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {question.type === "scale" && renderScaleQuestion()}
        {question.type === "multiple_choice" && renderMultipleChoice()}
        {question.type === "boolean" && renderBooleanQuestion()}
      </CardContent>
    </Card>
  )
}