"use client"


import { MobileHeader } from "../../../components/layout/mobile-header"
import { MobileNav } from "../../../components/layout/mobile-nav"
import { AdminDashboard } from "../../../components/admin/admin-dashboard"
import { Card } from "../../../components/ui/card"
import { Shield } from "lucide-react"
import { useTranslations } from "next-intl"
import { useAuth } from "../../../hooks/use-auth"

export default function AdminPage() {
  const t = useTranslations("admin_page");
  const { user }:any = useAuth()

  // Simple admin check - in real app, this would be more sophisticated
  const isAdmin = user?.email === "admin@gmail.com"

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader />
        <main className="px-4 py-6">
          <Card className="p-8">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">{t("signin_required")}</p>
            </div>
          </Card>
        </main>
        <MobileNav />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader />
        <main className="px-4 py-6">
          <Card className="p-8">
            <div className="text-center space-y-3">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
              <h2 className="text-lg font-semibold">{t("access_denied_title")}</h2>
              <p className="text-muted-foreground">{t("access_denied_description")}</p>
            </div>
          </Card>
        </main>
        <MobileNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />
      <main className="px-4 py-6">
        <AdminDashboard />
      </main>
      <MobileNav />
    </div>
  )
}