"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Edit, Archive, CheckCircle } from "lucide-react"
import type { ContentManagement } from "../../lib/admin"
import { updateContentStatus } from "../../lib/admin"
import { useToast } from "../../hooks/use-toast"
import { useTranslations } from "next-intl"

interface ContentManagementProps {
  content: ContentManagement[]
}

export function ContentManagementTable({ content }: ContentManagementProps) {
  const t = useTranslations("content_management");
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredContent, setFilteredContent] = useState(content)
  const { toast } = useToast()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = content.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.author.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredContent(filtered)
  }

  const handleStatusUpdate = async (contentId: string, newStatus: ContentManagement["status"]) => {
    try {
      await updateContentStatus(contentId, newStatus)
     
    } catch (error) {
      
    }
  }

  const getStatusBadge = (status: ContentManagement["status"]) => {
    switch (status) {
      case "published":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {t("status_published")}
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {t("status_draft")}
          </Badge>
        )
      case "archived":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            {t("status_archived")}
          </Badge>
        )
    }
  }

  const getTypeIcon = (type: ContentManagement["type"]) => {
    switch (type) {
      case "challenge":
        return "🎯"
      case "knowledge":
        return "📚"
      case "article":
        return "📝"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-lg">{t("title")}</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search_placeholder")}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("content_column")}</TableHead>
                <TableHead className="hidden sm:table-cell">{t("author_column")}</TableHead>
                <TableHead className="hidden sm:table-cell">{t("views_column")}</TableHead>
                <TableHead>{t("status_column")}</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContent.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{getTypeIcon(item.type)}</span>
                      <div>
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-muted-foreground capitalize">{t(`type_${item.type}`)}</div>
                        <div className="text-xs text-muted-foreground sm:hidden">
                          {t("mobile_content_details", { author: item.author, views: item.views })}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="text-sm">{item.author}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="text-sm">{item.views.toLocaleString()}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          {t("action_view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          {t("action_edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(item.id, "published")}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {t("action_publish")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(item.id, "archived")}>
                          <Archive className="mr-2 h-4 w-4" />
                          {t("action_archive")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}