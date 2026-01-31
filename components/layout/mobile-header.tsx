"use client";

import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  DrawerClose,
} from "../../components/ui/drawer";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, X, LogOut, User } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { Separator } from "../../components/ui/separator";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";
import { removeApiBaseUrl, removeUndefined } from "../../lib/utils";
import { BASE_URL } from "../../lib/API";

export function MobileHeader() {
  const router = useRouter();
  const t = useTranslations("mobile_header");
  const { theme, setTheme } = useTheme();
  const { user, signOut }: any = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const handleSignOut = () => {
    setOpen(false);

    signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="container px-2 flex h-14 items-center">
        <div className="flex-1">
          <h1 className="text-lg font-bold">
            {t("title_part1")}{" "}
            <span className="text-primary">{t("title_part2")}</span>
          </h1>
        </div>

        <Drawer open={open} onOpenChange={setOpen} direction="right">
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full overflow-hidden"
            >
              <Avatar>
                <AvatarImage
                  src={
                    user.avatar
                      ? BASE_URL + "/users/file/" + removeUndefined(user.avatar)
                      : "/user.png"
                  }
                  alt={user.name}
                />
              </Avatar>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-full pt-14">
            <div className="absolute right-4 top-4">
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
            <DrawerHeader className="border-b pb-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={
                      user.avatar
                        ? BASE_URL +
                          "/users/file/" +
                          removeUndefined(user.avatar)
                        : "/user.png"
                    }
                    alt={user.name}
                  />
                </Avatar>
                <div className="space-y-1">
                  <h2 className="font-semibold text-lg">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </DrawerHeader>
            <div className="p-4 w-full space-y-4">
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start text-base"
                onClick={() => {
                  router.push("/profile");
                  setOpen(false);
                }}
              >
                <div className="flex items-center">
                  <User className="mr-3 h-5 w-5" />
                  {t("profile")}
                </div>
              </Button>

              <LanguageSwitcher />

              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start text-base"
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                  setOpen(false);
                }}
              >
                <div className="flex items-center">
                  {theme === "dark" ? (
                    <SunIcon className="mr-3 h-5 w-5" />
                  ) : (
                    <MoonIcon className="mr-3 h-5 w-5" />
                  )}
                  {theme === "dark" ? t("light_mode") : t("dark_mode")}
                </div>
              </Button>

              <Separator />

              <Button
                variant="ghost"
                size="lg"
                onClick={handleSignOut}
                className="w-full justify-start text-base text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
              >
                <div className="flex items-center">
                  <LogOut className="mr-3 h-5 w-5" />
                  {t("sign_out")}
                </div>
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  );
}
