"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Clock, Star, CheckCircle, PlayCircle, Target } from "lucide-react"

interface Challenge {
  id: number
  title: string
  description: string
  points: number
  estimated_time: string
  instructions: string[]
  created_at: string
  updated_at: string
  deleted_at: null | string
}

interface UserProgress {
  status: "not_started" | "in_progress" | "completed"
  submission?: {
    content: string
    points: number
  }
}

interface ChallengeCardProps {
  challenge: Challenge
  progress?: UserProgress | null
  onStart: () => void
  onContinue: () => void
  onView: () => void
}

export function ChallengeCard({ challenge, progress, onStart, onContinue, onView }: ChallengeCardProps) {
  const getStatusButton = () => {
    if (!progress || progress.status === "not_started") {
      return (
        <Button onClick={onStart} className="w-full h-12 text-base">
          <PlayCircle className="mr-2 h-5 w-5" />
          Start Challenge
        </Button>
      )
    }

    if (progress.status === "in_progress") {
      return (
        <Button onClick={onContinue} variant="secondary" className="w-full h-12 text-base">
          <Target className="mr-2 h-5 w-5" />
          Continue
        </Button>
      )
    }

    return (
      <Button onClick={onView} variant="outline" className="w-full h-12 text-base bg-transparent">
        <CheckCircle className="mr-2 h-5 w-5" />
        View Submission
      </Button>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight text-balance">{challenge.title}</CardTitle>
            <CardDescription className="mt-2 text-sm leading-relaxed text-pretty">
              {challenge.description}
            </CardDescription>
          </div>
          {progress?.status === "completed" && <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 ml-2" />}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-4 pt-0">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs px-2 py-1">
              Daily Challenge
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{challenge.estimated_time}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Star className="h-4 w-4 flex-shrink-0 text-yellow-500" />
              <span>{challenge.points} points</span>
            </div>
          </div>
        </div>

        {getStatusButton()}
      </CardContent>
    </Card>
  )
}
