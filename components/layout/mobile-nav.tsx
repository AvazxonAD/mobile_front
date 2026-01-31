"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { cn } from "../../lib/utils"
import { HomeIcon, BookIcon, TargetIcon, TrophyIcon, PenIcon, MessageIcon } from "../../components/icons/modern-icons"

export function MobileNav() {
  const pathname = usePathname()
  const t = useTranslations("nav")

  const navItems = [
    {
      href: "/",
      icon: HomeIcon,
      label: t("home"),
    },
    {
      href: "/challenges",
      icon: TargetIcon,
      label: t("challenges"),
    },
    {
      href: "/knowledge",
      icon: BookIcon,
      label: t("knowledge"),
    },
    {
      href: "/chats",
      icon: MessageIcon,
      label: "xabarlar",
    },
    {
      href: "/articles",
      icon: PenIcon,
      label: t("articles"),
    },
    {
      href: "/progress",
      icon: TrophyIcon,
      label: t("progress"),
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t">
      <div className="flex h-20 items-center justify-around px-1 max-w-full mx-auto">
        <div className="flex h-full w-full max-w-[380px] items-center justify-around mx-auto gap-0.5 px-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.includes(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-1.5 py-2 rounded-lg transition-all duration-200 relative group flex-1 min-w-0",
                  isActive
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-primary rounded-t-full shadow-sm" />
                )}

                <item.icon
                  className={cn(
                    "h-5 w-5 transition-all duration-200 flex-shrink-0",
                    isActive ? "scale-110" : "group-hover:scale-105",
                  )}
                />

              
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
