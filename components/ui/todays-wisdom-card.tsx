"use client";

import { Card } from "./card";
import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTodayWisdomKey } from "../../lib/wisdom-utils";

export function TodaysWisdomCard() {
  const t = useTranslations();
  const wisdomKey = getTodayWisdomKey();

  const quote = t(`wisdom.${wisdomKey}.quote`);
  const author = t(`wisdom.${wisdomKey}.author`);
  const title = t("dashboard.todaysWisdom");

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-primary/20 rounded-full flex-shrink-0">
          <Zap className="h-4 w-4 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">{title}</h3>
          <blockquote className="text-sm italic text-pretty leading-relaxed">
            "{quote}"
          </blockquote>
          <cite className="text-xs text-muted-foreground">— {author}</cite>
        </div>
      </div>
    </Card>
  );
}
