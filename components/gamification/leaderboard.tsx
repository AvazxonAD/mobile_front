"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { getLeaderboard } from "../../lib/gamification"
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Medal, Award } from "lucide-react"

export function Leaderboard() {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "all_time">("all_time")
  const [leaderboardType, setLeaderboardType] = useState<"points" | "streak" | "challenges" | "level">("points")

  const entries = getLeaderboard(leaderboardType, timeframe)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const getScoreLabel = () => {
    switch (leaderboardType) {
      case "points":
        return "Points"
      case "streak":
        return "Days"
      case "challenges":
        return "Completed"
      case "level":
        return "Level"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-primary" />
            <CardTitle>Leaderboard</CardTitle>
          </div>
          <CardDescription>See how you rank among other growth enthusiasts</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Type Selection */}
          <Tabs value={leaderboardType} onValueChange={(value) => setLeaderboardType(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="points">Points</TabsTrigger>
              <TabsTrigger value="streak">Streak</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="level">Level</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Timeframe Selection */}
          <div className="flex space-x-2">
            <Button
              variant={timeframe === "daily" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("daily")}
            >
              Daily
            </Button>
            <Button
              variant={timeframe === "weekly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("weekly")}
            >
              Weekly
            </Button>
            <Button
              variant={timeframe === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={timeframe === "all_time" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("all_time")}
            >
              All Time
            </Button>
          </div>

          {/* Leaderboard List */}
          <div className="space-y-2">
            {entries.slice(0, 10).map((entry, index) => (
              <div
                key={entry.userId}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  entry.isCurrentUser ? "bg-primary/5 border-primary/20" : "bg-muted/30"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8">{getRankIcon(entry.rank)}</div>

                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.avatar || "/placeholder.svg"} alt={entry.username} />
                    <AvatarFallback>{entry.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${entry.isCurrentUser ? "text-primary" : ""}`}>
                        {entry.username}
                      </span>
                      {entry.isCurrentUser && (
                        <Badge variant="secondary" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">Rank #{entry.rank}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-semibold">
                      {entry.score.toLocaleString()} {getScoreLabel()}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      {getChangeIcon(entry.change)}
                      <span>{Math.abs(entry.change)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Current User Position (if not in top 10) */}
          {entries.findIndex((e) => e.isCurrentUser) >= 10 && (
            <div className="border-t pt-4">
              <div className="text-sm text-muted-foreground mb-2">Your Position:</div>
              {entries
                .filter((e) => e.isCurrentUser)
                .map((entry) => (
                  <div
                    key={entry.userId}
                    className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8">
                        <span className="text-sm font-bold text-primary">#{entry.rank}</span>
                      </div>

                      <Avatar className="h-8 w-8">
                        <AvatarImage src={entry.avatar || "/placeholder.svg"} alt={entry.username} />
                        <AvatarFallback>{entry.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-primary">{entry.username}</span>
                          <Badge variant="secondary" className="text-xs">
                            You
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">Rank #{entry.rank}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold">
                        {entry.score.toLocaleString()} {getScoreLabel()}
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        {getChangeIcon(entry.change)}
                        <span>{Math.abs(entry.change)}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
