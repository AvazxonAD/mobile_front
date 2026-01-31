"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Progress } from "../../components/ui/progress"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Separator } from "../../components/ui/separator"
import type { DiagnosticResult } from "../../lib/diagnostic"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  BookOpen,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react"
import { useTranslations } from "next-intl"

interface ResultsDisplayProps {
  result: DiagnosticResult
  onRetakeTest: () => void
}

export function ResultsDisplay({ result, onRetakeTest }: ResultsDisplayProps) {
  const t = useTranslations("results_display");
  const t_data = useTranslations("diagnostic_data"); // For category names
  const t_resources = useTranslations("resource_types"); // For resource types

  const getScoreIcon = (level: string) => {
    switch (level) {
      case "high":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "moderate":
        return <Minus className="h-4 w-4 text-yellow-500" />
      case "low":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getScoreColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-green-600 dark:text-green-400"
      case "moderate":
        return "text-yellow-600 dark:text-yellow-400"
      case "low":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Info className="h-4 w-4 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-8">
      {/* Overall Score */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("completed_on", { date: result.completedAt.toLocaleDateString() })}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl font-bold text-primary">{result.overallScore}%</div>
          <p className="text-muted-foreground">{t("overall_score")}</p>
          <Progress value={result.overallScore} className="w-full max-w-md mx-auto" />
        </CardContent>
      </Card>

      {/* Category Scores */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{t("detailed_results_title")}</h3>
        <div className="grid gap-4">
          {Object.entries(result.scores).map(([category, score]) => (
            <Card key={category}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getScoreIcon(score.level)}
                    <h4 className="font-medium capitalize">{t_data(`category_${category}`)}</h4>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${getScoreColor(score.level)}`}>{score.percentage}%</div>
                    <div className="text-xs text-muted-foreground">
                      {score.score}/{score.maxScore}
                    </div>
                  </div>
                </div>
                <Progress value={score.percentage} className="h-2" />
                <div className="mt-2 text-sm text-muted-foreground capitalize">{t("level_text", { level: score.level })}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{t("recommendations_title")}</h3>
        <p className="text-muted-foreground">
          {t("recommendations_description")}
        </p>

        <div className="space-y-6">
          {result.recommendations.map((recommendation) => (
            <Card key={recommendation.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {getPriorityIcon(recommendation.priority)}
                      <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(recommendation.priority)}>
                        {t("priority_text", { priority: recommendation.priority })} 
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {t_data(`category_${recommendation.category}`)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-base">{recommendation.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    {t("action_items_title")}
                  </h5>
                  <ul className="space-y-1 ml-6">
                    {recommendation.actionItems.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>{t("expected_impact_label")}</strong> {recommendation.estimatedImpact}
                  </p>
                </div>

                {recommendation.resources.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {t("recommended_resources_title")}
                    </h5>
                    <div className="space-y-2">
                      {recommendation.resources.map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {t_resources(resource.type)}
                            </Badge>
                            <span className="text-sm">{resource.title}</span>
                          </div>
                          {resource.url && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Button onClick={onRetakeTest} variant="outline">
          {t("retake_button")}
        </Button>
        <Button>{t("save_button")}</Button>
      </div>
    </div>
  )
}
