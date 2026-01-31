"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

import {
  AlertCircle,
  Upload,
  Camera,
  Loader2,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { useTranslations } from "next-intl";

import { useToast } from "../../hooks/use-toast";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export function SignupForm({ onToggleMode }: { onToggleMode: () => void }) {
  const t = useTranslations("signup");
  const router = useRouter();
  const params = useParams();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+998",
    password: "",
    avatar: null as File | null,
    avatarPreview: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formatPhoneNumber = (input: string) => {
    const numbers = input.replace(/[^\d]/g, "");
    const withPrefix = numbers.startsWith("998") ? numbers : "998" + numbers;
    const trimmed = withPrefix.slice(0, 12);
    return trimmed.length >= 3 ? "+998" + trimmed.slice(3) : "+998";
  };

  const validatePhoneNumber = (value: string) => {
    const phoneRegex = /^\+998[0-9]{9}$/;
    return phoneRegex.test(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formattedNumber }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: t("validation_error"),
        description: t("avatarTooLarge"),
      });
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: t("validation_error"),
        description: t("invalidAvatarType"),
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      avatar: file,
      avatarPreview: previewUrl,
    }));
  };

  const validateForm = () => {
    const { name, email, phone, password } = formData;

    if (!name || !email || !phone || !password) {
      toast({
        variant: "destructive",
        title: t("validation_error"),
        description: t("allFieldsRequired"),
      });
      return false;
    }

    if (!validatePhoneNumber(phone)) {
      toast({
        variant: "destructive",
        title: t("validation_error"),
        description: t("invalidPhoneNumber"),
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: t("validation_error"),
        description: t("passwordTooShort"),
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const { name, email, phone, password, avatar } = formData;

    try {
      const user = await signUp(email, password, name, phone, avatar);
      console.log("Registration attempt with data:", { email, name, phone });
      console.log("Registration response:", user);

      if (user) {
        const locale = params?.locale?.toString() || "uz";
        window.location.href = `/${locale}`;
      } else {
        throw new Error("Registration failed - no user returned");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast({
        variant: "destructive",
        title: t("error"),
        description:
          err instanceof Error ? err.message : t("registration_failed"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-4">
            <Label
              className="text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {t("avatar_label")}
            </Label>
            <div
              className="relative cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={formData.avatarPreview || "/placeholder-user.jpg"}
                />
                <AvatarFallback>
                  {isUploadingAvatar ? (
                    <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                  ) : (
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="w-6 h-6 text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
              disabled={isLoading || isUploadingAvatar}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">{t("name_label")}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              disabled={isLoading}
              placeholder="John Doe"
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t("phone_label")}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="+998 90 123 45 67"
              disabled={isLoading}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("email_label")}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              disabled={isLoading}
              required
              className="h-12"
            />
          </div>

          {/* ✅ Password with show/hide */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {t("password_label")}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                disabled={isLoading}
                required
                className="h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
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
            disabled={isLoading || isUploadingAvatar}
          >
            {isLoading || isUploadingAvatar ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {isUploadingAvatar ? "change avatar" : "Sign up"}
              </div>
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
          disabled={isLoading || isUploadingAvatar}
          className="w-full h-12 text-base transition-all hover:scale-[1.02]"
        >
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}
