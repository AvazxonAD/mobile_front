"use client";

import { Metadata } from "next";
import { useState } from "react";

import { LoginForm } from "../../components/auth/login-form";
import { SignupForm } from "../../components/auth/signup-form";
import { MobileHeader } from "../../components/layout/mobile-header";
import { MobileNav } from "../../components/layout/mobile-nav";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
  Target,
  BookOpen,
  Trophy,
  TrendingUp,
  Star,
  Flame,
  Brain,
  Zap,
  Award,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth } from "../../hooks/use-auth";
import { TodaysWisdomCard } from "../../components/ui/todays-wisdom-card";
import VideoCarousel from "../../components/video-carousel";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <SignupForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const { user }: any = useAuth();
  const t = useTranslations();

  if (!user) return null;

  const levelProgress = ((user.total_points % 1000) / 1000) * 100;

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />

      <main className="px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-balance leading-tight">
            {t("dashboard.welcomeBack")}!
          </h1>
          <p className="text-sm text-muted-foreground text-pretty px-2">
            {t("dashboard.readyToContinue")}
          </p>
        </div>
        <VideoCarousel />
        {/* Wisdom Card */}

        <TodaysWisdomCard />

        {/* Stats Overview - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {t("dashboard.streak")}
              </Badge>
            </div>
            <div className="text-xl font-bold">{user.streak}</div>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.daysStrong")}
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {t("dashboard.points")}
              </Badge>
            </div>
            <div className="text-xl font-bold">{user.total_points}</div>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.totalEarned")}
            </p>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="font-semibold">
                {t("dashboard.level")} {user.level || "0"}
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              {Math.round(levelProgress)}% {t("dashboard.toNext")}
            </Badge>
          </div>
          <Progress value={levelProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {1000 - (user.total_points % 1000)} {t("dashboard.pointsTo")}{" "}
            {t("dashboard.level")} {user.level || 0 + 1}
          </p>
        </Card>

        {/* Quick Actions - Mobile Grid */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            {t("dashboard.quickActions")}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/challenges">
              <Card className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium">
                    {t("actions.dailyChallenge")}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {t("actions.new")}
                  </Badge>
                </div>
              </Card>
            </Link>

            <Link href="/assessment">
              <Card className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-3 bg-secondary/10 rounded-full">
                    <Brain className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="text-sm font-medium">
                    {t("actions.assessment")}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {t("actions.aiPowered")}
                  </Badge>
                </div>
              </Card>
            </Link>

            <Link href="/knowledge">
              <Card className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <BookOpen className="h-6 w-6 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium">
                    {t("actions.learn")}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {t("actions.hub")}
                  </Badge>
                </div>
              </Card>
            </Link>

            <Link href="/progress">
              <Card className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-3 bg-green-500/10 rounded-full">
                    <Trophy className="h-6 w-6 text-green-500" />
                  </div>
                  <span className="text-sm font-medium">
                    {t("nav.progress")}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {t("actions.track")}
                  </Badge>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();

  // Admin bo'lsa admin panelga yo'naltirish
  if (user?.is_admin) {
    return <Dashboard />;
  }

  // Autentifikatsiya qilingan user bo'lsa dashboard ko'rsatish
  if (isAuthenticated && user) {
    return <Dashboard />;
  }

  // Aks holda login formni ko'rsatish
  return <AuthPage />;
}
