"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import {
  articleCategories,
  calculateReadingTime,
  generateExcerpt,
  submitArticle,
  updateArticle,
} from "../../lib/articles"
import { useAuth } from "../../hooks/use-auth"
import { useToast } from "../../hooks/use-toast"
import { Save, Send, X, Plus } from "lucide-react"
import { useTranslations } from "next-intl"


interface ArticleFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  editingArticle?: any | null
}

export function ArticleForm({ onSuccess, onCancel, editingArticle }: ArticleFormProps) {
  const t = useTranslations("article_form")

  const [title, setTitle] = useState(editingArticle ? editingArticle.title : "")
  const [content, setContent] = useState(editingArticle ? editingArticle.content : "")
  const [category, setCategory] = useState(editingArticle ? editingArticle.category : "")
  const [tags, setTags] = useState<string[]>(editingArticle ? editingArticle.tags : [])
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user }: any = useAuth()
  const { toast } = useToast()

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim().toLowerCase()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (status: "draft" | "submitted") => {
    if (!user) {
      toast({
        title: t("toast_auth_required_title"),
        description: t("toast_auth_required_description"),
        variant: "destructive",
      })
      return
    }

    if (!title.trim() || !content.trim() || !category) {
      toast({
        title: t("toast_missing_info_title"),
        description: t("toast_missing_info_description"),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const article = {
        title: title.trim(),
        content: content.trim(),
        excerpt: generateExcerpt(content),
        author: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        category,
        tags,
        status,
        readingTime: calculateReadingTime(content),
      }

      if (editingArticle) {
        await updateArticle(editingArticle.id, article)
      } else {
        await submitArticle(article)
      }

      toast({
        title: status === "draft" ? t("toast_draft_saved_title") : t("toast_article_submitted_title"),
        description: status === "draft" ? t("toast_draft_saved_description") : t("toast_article_submitted_description"),
      })

      // Reset form
      setTitle("")
      setContent("")
      setCategory("")
      setTags([])
      setNewTag("")
    } catch (error) {
      toast({
        title: t("toast_error_title"),
        description: t("toast_error_description"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const readingTime = content ? calculateReadingTime(content) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("title_card")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">{t("title_label")}</Label>
          <Input
            id="title"
            placeholder={t("title_placeholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-base"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">{t("category_label")}</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder={t("category_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {articleCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <div className="flex items-center space-x-2">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>{t("tags_label")}</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
                <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder={t("add_tag_placeholder")}
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTag}
              disabled={!newTag.trim() || tags.length >= 5}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{t("tags_help_text")}</p>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="content">{t("content_label")}</Label>
            {readingTime > 0 && (
              <span className="text-xs text-muted-foreground">{t("reading_time", { readingTime })}</span>
            )}
          </div>
          <Textarea
            id="content"
            placeholder={t("content_placeholder")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] text-base leading-relaxed"
          />
          <p className="text-xs text-muted-foreground">{t("content_help_text")}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={() => handleSubmit("draft")}
            variant="outline"
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="flex-1"
          >
            <Save className="mr-2 h-4 w-4" />
            {t("save_draft_button")}
          </Button>
          <Button
            onClick={() => handleSubmit("submitted")}
            disabled={isSubmitting || !title.trim() || !content.trim() || !category}
            className="flex-1"
          >
            <Send className="mr-2 h-4 w-4" />
            {t("submit_button")}
          </Button>
          {onCancel && (
            <Button onClick={onCancel} variant="ghost" disabled={isSubmitting}>
              {t("cancel_button")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
