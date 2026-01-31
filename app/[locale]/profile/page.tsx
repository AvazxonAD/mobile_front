"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Mail, Phone, Edit2, Check, X, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "../../../hooks/use-auth";
import { useRouter } from "next/navigation";
import { removeApiBaseUrl, removeApiBaseUrll } from "../../../lib/utils";

// ==================== TYPES ====================

interface ProfileViewProps {
  userData: any;
}

function ProfileView({ userData }: ProfileViewProps) {
  const t = useTranslations("p");

  return (
    <div className="space-y-6">
      <div className="flex justify-center sm:justify-start">
        <img
          src={"https://mobile-production-732f.up.railway.app/api/users/file/" + removeApiBaseUrl(userData.avatar)}
          alt={userData.name}
          className="h-32 w-32 rounded-full border-4 border-primary object-cover shadow-lg sm:h-40 sm:w-40"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">{t("profile.name")}</p>
          <p className="mt-2 text-lg font-semibold">{userData.name}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-primary" />
            <p className="text-sm font-medium text-muted-foreground">{t("profile.email")}</p>
          </div>
          <p className="mt-2 truncate text-lg font-semibold">{userData.email}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-primary" />
            <p className="text-sm font-medium text-muted-foreground">{t("profile.phone")}</p>
          </div>
          <p className="mt-2 text-lg font-semibold">{userData.phone}</p>
        </div>
      </div>
    </div>
  );
}

interface ProfileFormProps {
  userData: any;
  setIsEditing: (value: boolean) => void;
}

function ProfileForm({ userData, setIsEditing }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    password: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(
    "https://mobile-production-732f.up.railway.app/api/users/file/" + removeApiBaseUrl(userData.avatar) || "/placeholder-user.jpg",
  );

  const [saving, setSaving] = useState(false);
  const { updateUser, refreshUser } = useAuth();
  const t = useTranslations("p");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      // Only include password if it's actually being changed
      if (formData.password && formData.password.trim() !== "") {
        updates.password = formData.password;
      }

      if (avatarFile) {
        updates.avatar = avatarFile;
      }

      const result = await updateUser(userData.id.toString(), updates);
      if (result.error) {
        throw new Error(result.error.message);
      }

      // Refresh user data from backend
      await refreshUser();

      // Reset password field after successful update
      setFormData((prev) => ({
        ...prev,
        password: "",
      }));

      setIsEditing(false);
    } catch (error: any) {
      console.error("Save error:", error);
      // You might want to show an error toast here
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center sm:justify-start">
        <div className="relative">
          <img
            src={"https://mobile-production-732f.up.railway.app/api/users/file/" + removeApiBaseUrl(userData.avatar)}
            alt={userData.name}
            className="h-32 w-32 rounded-full border-4 border-primary object-cover shadow-lg sm:h-40 sm:w-40"
          />
          <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-primary p-2 text-white shadow-lg hover:opacity-90">
            <Edit2 size={18} />
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">{t("profile.name")}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground">{t("profile.email")}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground">{t("profile.phone")}</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-3 pt-4 sm:gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Check size={18} />
            <span>{saving ? t("common.saving") : t("common.save")}</span>
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-input bg-card px-4 py-2 font-medium text-foreground transition-colors hover:bg-muted"
          >
            <X size={18} />
            <span>{t("common.cancel")}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

interface ProfileHeaderProps {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

function ProfileHeader({ isEditing, setIsEditing }: ProfileHeaderProps) {
  const t = useTranslations("p");
  const router = useRouter();

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center">
        <button onClick={() => router.back()} className="mr-4 rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label={"back"}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold sm:text-4xl">{t("profile.title")}</h1>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-opacity hover:opacity-90"
          aria-label={isEditing ? t("common.cancel") : t("common.edit")}
        >
          <Edit2 size={18} />
          <span className="text-sm font-medium sm:text-base">{isEditing ? t("common.cancel") : t("common.edit")}</span>
        </button>
      </div>
    </div>
  );
}

interface ProfileContentProps {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  userData: any;
}

function ProfileContent({ isEditing, setIsEditing, userData }: ProfileContentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("p");

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return isEditing ? <ProfileForm userData={userData} setIsEditing={setIsEditing} /> : <ProfileView userData={userData} />;
}

function ProfilePageContent() {
  const { user }: any = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  console.log(user.avatar);
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <main className="container mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <ProfileHeader isEditing={isEditing} setIsEditing={setIsEditing} />
        <ProfileContent isEditing={isEditing} setIsEditing={setIsEditing} userData={user} />
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return <ProfilePageContent />;
}
