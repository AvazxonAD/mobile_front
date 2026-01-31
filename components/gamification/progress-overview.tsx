"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import { BadgeCard } from "./badge-card";
import { Leaderboard } from "./leaderboard";
import { availableBadges } from "../../lib/gamification";
import { useAuth } from "../../hooks/use-auth";
import { TrendingUp, Star, Flame, Award } from "lucide-react";
import { useTranslations } from "next-intl";

export function ProgressOverview() {
  const t = useTranslations("progress_overview");
  const { user }: any = useAuth();

  if (!user) return null;

  const userStats = {
    ...user,
    totalPoints: 1250,
    currentStreak: 7,
    longestStreak: 12,
    challengesCompleted: 15,
    assessmentsTaken: 2,
    articlesRead: 8,
    daysActive: 25,
    badgesEarned: ["first-step", "early-bird", "challenger"],
    joinedAt: new Date("2024-01-01"),
    lastActiveAt: new Date(),
  };
  const userAchievements = [
    {
      id: "1",
      userId: "1",
      badgeId: "first-step",
      unlockedAt: new Date("2024-01-01"),
      progress: 1,
      maxProgress: 1,
      isCompleted: true,
    },
    {
      id: "2",
      userId: "1",
      badgeId: "early-bird",
      unlockedAt: new Date("2024-01-07"),
      progress: 7,
      maxProgress: 7,
      isCompleted: true,
    },
    {
      id: "3",
      userId: "1",
      badgeId: "challenger",
      unlockedAt: new Date("2024-01-10"),
      progress: 10,
      maxProgress: 10,
      isCompleted: true,
    },
    {
      id: "4",
      userId: "1",
      badgeId: "consistent",
      unlockedAt: new Date(),
      progress: 25,
      maxProgress: 30,
      isCompleted: false,
    },
  ];

  if (!userStats) return null;

  const earnedBadges = userAchievements.filter((a: any) => a.isCompleted);
  const inProgressBadges = userAchievements.filter((a: any) => !a.isCompleted);
  const availableForEarning = availableBadges.filter(
    (badge) => !userAchievements.some((a: any) => a.badgeId === badge.id)
  );

  const levelProgress = ((userStats.total_points % 1000) / 1000) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-pretty">{t("description")}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("current_level_card_title")}
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {t("level_display", { level: userStats.level || 0 })}
            </div>
            <Progress value={levelProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("current_streak_card_title")}
            </CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.streak} Point</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("total_points_card_title")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.total_points.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("badges_earned_card_title")}
            </CardTitle>
            <Award className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.badges.length}</div>
            <p className="text-xs text-muted-foreground">
              {t("badges_available_display", { count: availableBadges.length })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Badges Section */}
      <div className="space-y-6">
        {/* Earned Badges */}
        {userStats.badges.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              {t("earned_badges_section_title", {
                count: userStats.badges.length,
              })}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userStats.badges.map((achievement: any) => {
                const badge = availableBadges.find(
                  (b) => b.id == achievement.id
                );
                if (!badge) return null;

                return (
                  <BadgeCard
                    key={achievement.id}
                    badge={badge}
                    achievement={achievement}
                    showProgress={false}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* In Progress Badges */}
        {inProgressBadges.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              {t("in_progress_badges_section_title", {
                count: inProgressBadges.length,
              })}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {inProgressBadges.map((achievement: any) => {
                const badge = availableBadges.find(
                  (b) => b.id == achievement.badgeId
                );
                if (!badge) return null;

                return (
                  <BadgeCard
                    key={achievement.id}
                    badge={badge}
                    achievement={achievement}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Available Badges */}
        {availableForEarning.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              {t("available_badges_section_title", {
                count: availableForEarning.length,
              })}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableForEarning.slice(0, 8).map((badge) => (
                <BadgeCard key={badge.id} badge={badge} showProgress={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
