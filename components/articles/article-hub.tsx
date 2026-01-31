"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { ArticleForm } from "./article-form"
import { ArticleList } from "./article-list"
import { PenTool, FileText } from "lucide-react"
import type { ArticleSubmission } from "../../lib/articles"
import { useTranslations } from "next-intl"

export function ArticleHub() {
  const t = useTranslations("article_hub")
  const [activeTab, setActiveTab] = useState("list")
  const [editingArticle, setEditingArticle] = useState<ArticleSubmission | null>(null)

  const handleNewArticle = () => {
    setEditingArticle(null)
    setActiveTab("write")
  }

  const handleEditArticle = (article: ArticleSubmission) => {
    setEditingArticle(article)
    setActiveTab("write")
  }

  const handleFormSuccess = () => {
    setActiveTab("list")
    setEditingArticle(null)
  }

  const handleFormCancel = () => {
    setActiveTab("list")
    setEditingArticle(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <Button onClick={handleNewArticle} className="hidden sm:flex">
          <PenTool className="mr-2 h-4 w-4" />
          {t("write_article_button")}
        </Button>
      </div>

      {/* Mobile Write Button */}
      <Button onClick={handleNewArticle} className="w-full sm:hidden">
        <PenTool className="mr-2 h-4 w-4" />
        {t("write_new_article_button")}
      </Button>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>{t("my_articles_tab")}</span>
          </TabsTrigger>
          <TabsTrigger value="write" className="flex items-center space-x-2">
            <PenTool className="h-4 w-4" />
            <span>{editingArticle ? t("edit_tab") : t("write_tab")}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <ArticleList onEdit={handleEditArticle} />
        </TabsContent>

        <TabsContent value="write" className="space-y-4">
          <ArticleForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
