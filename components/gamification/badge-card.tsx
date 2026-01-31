"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import type { Badge as BadgeType, Achievement } from "../../lib/gamification"
import { getRarityColor, getCategoryColor } from "../../lib/gamification"
import { CheckCircle, Lock, Star } from "lucide-react"

interface BadgeCardProps {
  badge: BadgeType
  achievement?: Achievement
  showProgress?: boolean
}

export function BadgeCard({ badge, achievement, showProgress = true }: BadgeCardProps) {
  const isUnlocked = achievement
  const progress = achievement ? (achievement.progress / achievement.maxProgress) * 100 : 0

  return (
    <Card className={`relative overflow-hidden ${isUnlocked ? "ring-2 ring-primary/20" : "opacity-75"}`}>
      {isUnlocked && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
        </div>
      )}

      {!isUnlocked && !achievement && (
        <div className="absolute top-2 right-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="text-4xl mb-2">{badge.icon}</div>
        <CardTitle className="text-lg">{badge.name}</CardTitle>
        <CardDescription className="text-sm">{badge.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-center space-x-2">
          <Badge className={getRarityColor(badge.rarity)} variant="secondary">
            {badge.rarity}
          </Badge>
          <Badge className={getCategoryColor(badge.category)} variant="outline">
            {badge.category}
          </Badge>
        </div>

        <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
          <Star className="h-3 w-3" />
          <span>{badge.points} points</span>
        </div>

        {showProgress && achievement && !achievement.isCompleted && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>
                {achievement.progress}/{achievement.maxProgress}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {isUnlocked && achievement?.unlockedAt && (
          <div className="text-center text-xs text-muted-foreground">
            Unlocked {achievement.unlockedAt.toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
