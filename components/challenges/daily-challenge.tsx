// app/components/DailyChallenge.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { ChallengeCard } from "./challenge-card";
import { ChallengeDetail } from "./challenge-detail";
import { useToast } from "../../hooks/use-toast";
import { getChallenges } from "../../lib/api-client";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface Challenge {
  id: number;
  title: string;
  description: string;
  points: number;
  estimated_time: string;
  instructions: string[];
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
}

interface UserProgress {
  status: "not_started" | "in_progress" | "completed";
  submission?: {
    content: string;
    points: number;
  };
}

interface SavedStatus {
  date: string;
  status: "completed";
}

export function DailyChallenge() {
  const t = useTranslations("daily_challenge");
  const [todaysChallenge, setTodaysChallenge] = useState<Challenge | null>(
    null
  );
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDoneToday, setIsDoneToday] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const saved = localStorage.getItem("dailyChallengeStatus");

    if (saved) {
      try {
        const parsed: SavedStatus = JSON.parse(saved);
        if (parsed.date === today && parsed.status === "completed") {
          setIsDoneToday(true);
          setLoading(false);
          router.refresh();
          return;
        }
      } catch {
        localStorage.removeItem("dailyChallengeStatus");
      }
    }

    const fetchChallenge = async () => {
      try {
        const result = await getChallenges();
        if (
          result.success &&
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          const challenge = result.data[0] as Challenge;
          setTodaysChallenge(challenge);
          setProgress({ status: "not_started" });
          setError(null);
        } else {
          throw new Error("No challenges available");
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError("Failed to load challenge. Please check your API connection.");
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [toast]);

  const handleStartChallenge = () => {
    if (!todaysChallenge) return;
    setProgress({ status: "in_progress" });
    setShowDetail(true);
  };

  const handleChallengeComplete = () => {
    if (!todaysChallenge) return;
    const today = new Date().toISOString().slice(0, 10);
    const data: SavedStatus = { date: today, status: "completed" };
    localStorage.setItem("dailyChallengeStatus", JSON.stringify(data));
    setProgress({
      status: "completed",
      submission: { content: "", points: todaysChallenge.points },
    });
    setIsDoneToday(true);
    setShowDetail(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading today's challenge...</p>
        </CardContent>
      </Card>
    );
  }

  if (isDoneToday) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-2">
          <Calendar className="h-6 w-6 text-green-500" />
          <p className="text-lg font-semibold text-green-600">
            🎉 You’ve done today’s challenge!
          </p>
          <p className="text-sm text-muted-foreground">
            Come back tomorrow for a new one.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error || !todaysChallenge) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">
            {error || "No challenge available today"}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (showDetail) {
    return (
      <ChallengeDetail
        challenge={todaysChallenge}
        progress={progress}
        onBack={() => setShowDetail(false)}
        onComplete={handleChallengeComplete}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold">{t("title")}</h1>
        </div>
        <p className="text-sm text-muted-foreground px-4">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="w-full">
        <ChallengeCard
          challenge={todaysChallenge}
          progress={progress}
          onStart={handleStartChallenge}
          onContinue={() => setShowDetail(true)}
          onView={() => setShowDetail(true)}
        />
      </div>
    </div>
  );
}
