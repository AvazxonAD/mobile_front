"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { getArticles, deleteArticle } from "../../lib/articles"
import { useAuth } from "../../hooks/use-auth"
import { useToast } from "../../hooks/use-toast"
import { Search, MoreHorizontal, Edit, Trash2, Clock, ChevronLeft, ChevronRight, User, Calendar } from "lucide-react"

interface ArticleListProps {
  onEdit?: (article: any) => void
}

export function ArticleList({ onEdit }: ArticleListProps) {
  const [articles, setArticles] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredArticles, setFilteredArticles] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [limit] = useState(20)
  const { user }: any = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadArticles() {
      try {
        setIsLoading(true)
        const result = await getArticles(currentPage, limit)
        setArticles(result.articles || [])
        setFilteredArticles(result.articles || [])
        setTotalPages(result.meta?.total_pages || 0)
      } catch (error) {
        console.error("Failed to load articles:", error)
        toast({
          title: "Error",
          description: "Failed to load articles",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadArticles()
  }, [currentPage])

  useEffect(() => {
    const filtered = articles.filter((article) => article.title.toLowerCase().includes(searchQuery.toLowerCase()))
    setFilteredArticles(filtered)
  }, [searchQuery, articles])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      Technology: "bg-blue-100 text-blue-800",
      Business: "bg-purple-100 text-purple-800",
      Science: "bg-green-100 text-green-800",
      Health: "bg-red-100 text-red-800",
      Education: "bg-orange-100 text-orange-800",
      Other: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors.Other
  }

  const handleDelete = async (articleId: string) => {
    try {
      await deleteArticle(articleId)
      setArticles(articles.filter((a) => a.id !== articleId))
      toast({
        title: "Success",
        description: "Article deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">Loading articles...</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search articles by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Articles */}
      {filteredArticles.length === 0 ? (
        <Card className="p-8">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">{searchQuery ? "No articles found" : "No articles yet"}</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg leading-tight text-balance">{article.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2 text-pretty line-clamp-2">{article.excerpt}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(article)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(String(article.id))} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge className={`${getCategoryBadgeColor(article.category)} font-medium`}>{article.category}</Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t pt-3">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{article.user_name}</span>
                    <span>({article.user_email})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(article.created_at)}</span>
                  </div>
                  {article.updated_at && article.updated_at !== article.created_at && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Updated {formatDate(article.updated_at)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
