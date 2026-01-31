// app/components/admin/AdminDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

import { UserManagementReal } from "./user-management";
import { getAdminStats } from "../../lib/admin";
import { useTranslations } from "next-intl";
import type { AdminStats } from "../../lib/admin";
import { Spinner } from "../ui/spinner";
import { BooksTable } from "./Books-table";
import { getBooks } from "../../lib/books";
import { ChallengesTable } from "./challenges-table";
import { VideosTable } from "./videos-table";
import { Users, Target, BookOpen, Video } from "lucide-react";

export function AdminDashboard() {
  const t = useTranslations("admin_dashboard");
  const [stats, setStats] = useState<AdminStats | null>(null);
 
  const [activeTab, setActiveTab] = useState<string>("challenges");

  // 🔹 Load saved tab from localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem("adminActiveTab");
    if (savedTab) setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    setStats(getAdminStats());
   
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    );
  }

  // 🔹 Handle tab change and persist
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem("adminActiveTab", value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm ">Barcha resurslarga kirish va boshqarish</p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4 bg-muted/30 p-1 rounded-lg">
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-[#2563eb] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition"
          >
            <Users className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger
            value="challenges"
            className="data-[state=active]:bg-[#2563eb] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition"
          >
            <Target className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger
            value="books"
            className="data-[state=active]:bg-[#2563eb] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition"
          >
            <BookOpen className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="data-[state=active]:bg-[#2563eb] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition"
          >
            <Video className="h-5 w-5" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UserManagementReal />
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <ChallengesTable />
        </TabsContent>

        <TabsContent value="books" className="space-y-4">
          <BooksTable  />
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <VideosTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
