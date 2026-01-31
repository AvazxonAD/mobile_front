"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

import { Mail, Lock, Loader2, EyeOff, Eye } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "../../hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { OnboardingSlides } from "./onboarding-slides";

export function LoginForm({ onToggleMode }: { onToggleMode: () => void }) {
  const t = useTranslations("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await signIn(email, password);

      if (user) {
        if (user.is_admin) {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  if (showOnboarding) {
    return <OnboardingSlides onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {t("email_label")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t("email_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {t("password_label")}
            </Label>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-12 pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base transition-all hover:scale-[1.02]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              t("submit_button")
            )}
          </Button>
        </CardContent>
      </form>

      <CardFooter className="flex flex-col space-y-4 pt-4">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground"></span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          onClick={onToggleMode}
          disabled={isLoading}
          className="w-full h-12 text-base transition-all hover:scale-[1.02]"
        >
          {t("signup_button")}
        </Button>
      </CardFooter>
    </Card>
  );
}
