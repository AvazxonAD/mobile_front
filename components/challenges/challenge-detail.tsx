"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { useToast } from "../../hooks/use-toast";
import { submitChallenge } from "../../lib/api-client";
import { ArrowLeft, Send } from "lucide-react";

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

interface ChallengeDetailProps {
  challenge: Challenge;
  progress?: UserProgress | null;
  onBack: () => void;
  onComplete: () => void;
}

export function ChallengeDetail({
  challenge,
  progress,
  onBack,
  onComplete,
}: ChallengeDetailProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide your response before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setIsRunning(false);

    try {
      const result = await submitChallenge(
        content,
        formatTime(timeElapsed),
        challenge.id
      );

      if (result.success) {
        toast({
          title: "Challenge Completed!",
          description: `You earned ${challenge.points} points. Great work!`,
        });
        onComplete();
        window.location.reload();
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("[v0] Submission error:", errorMsg);
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsRunning(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCompleted = progress?.status === "completed";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        {!isCompleted && (
          <div className="text-lg font-mono font-semibold text-primary">
            {formatTime(timeElapsed)}
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{challenge.title}</CardTitle>
          <CardDescription className="text-base mt-2">
            {challenge.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Instructions</h3>
            <ol className="space-y-2">
              {challenge.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          <Separator />

          {isCompleted && progress?.submission ? (
            <div className="space-y-4">
              <h3 className="font-semibold">Your Submission</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="whitespace-pre-wrap">
                  {progress.submission.content}
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Time: {formatTime(timeElapsed)}</span>
                <span>•</span>
                <span>{progress.submission.points} points earned</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="content">Your Response *</Label>
                <Textarea
                  id="content"
                  placeholder="Share your experience, thoughts, or what you accomplished..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-2 min-h-[120px]"
                  disabled={isSubmitting}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !content.trim()}
                className="w-full"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Challenge
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
