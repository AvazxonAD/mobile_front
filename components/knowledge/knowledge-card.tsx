"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  FileText,
  MessageSquare,
  Send,
  Loader2,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getBookFile, getBookImage } from "../../lib/books";
import { useAuth } from "../../hooks/use-auth";
import { formatToDDMMYYYY, removeBookUrl } from "../../lib/utils";
import { BASE_URL } from "../../lib/API";

interface Comment {
  id: number;
  comment: string;
  user_id: number;
  user_name: string;
  created_at: string;
}

export function KnowledgeCard({ item }: any) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [displayCount, setDisplayCount] = useState(5);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const res = await fetch(BASE_URL + `/comments?book_id=${item.id}`);
      if (!res.ok) throw new Error("Izohlarni yuklashda xatolik yuz berdi");
      const data = await res.json();
      setComments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    if (!user?.id) {
      alert("Izoh yozish uchun tizimga kiring!");
      return;
    }

    try {
      setPosting(true);
      const res = await fetch(BASE_URL + "/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: commentText.trim(),
          user_id: user.id,
          book_id: item.id,
        }),
      });

      if (!res.ok) throw new Error("Izoh yuborishda xatolik yuz berdi");

      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
      fetchComments();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = (id: number) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  const userComments = comments.filter(
    (comment) => comment.user_id === user?.id
  );
  const otherComments = comments.filter(
    (comment) => comment.user_id !== user?.id
  );

  const allComments = [...otherComments, ...userComments];
  const displayedComments = allComments.slice(0, displayCount);
  const hasMoreComments = allComments.length > displayCount;

  return (
    <Card className="h-full flex flex-col group hover:shadow-lg transition-shadow">
      {item.image_url && (
        <div className="relative h-56 w-full rounded-t-lg bg-muted/10">
          <Image
            src={String(getBookImage(item.image_url))}
            alt={item.title}
            fill
            className="object-contain"
          />
        </div>
      )}

      <CardHeader className="flex-1">
        <CardTitle className="text-lg leading-tight line-clamp-2">
          {item.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {item.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <FileText className="h-4 w-4 mr-2" />
          <span className="truncate">{item.title}</span>
          {item.file_size && (
            <span className="ml-auto">
              {(Number(item.file_size) / 1024 / 1024).toFixed(1)} MB
            </span>
          )}
        </div>

        <Button
          onClick={() => window.open(String(getBookImage(item.file_name)))}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          <FileText className="mr-2 h-4 w-4" />
          Read
        </Button>

        <div className="border-t pt-4 space-y-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Izohlar ({comments.length})</span>
          </button>

          {showComments && (
            <div className="space-y-3 flex flex-col h-full">
              <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
                {/* Display comments section */}
                <div className="space-y-3 overflow-y-auto flex-1">
                  {loadingComments ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  ) : comments.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">
                      Hali izoh yo'q
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {displayedComments.map((comment) => {
                        const isOwnComment = comment.user_id === user?.id;
                        return (
                          <div
                            key={comment.id}
                            className={`flex ${
                              isOwnComment ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`p-3 rounded-lg max-w-xs border ${
                                isOwnComment
                                  ? "bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700"
                                  : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                              }`}
                            >
                              <p
                                className={`font-semibold text-sm ${
                                  isOwnComment
                                    ? "text-blue-900 dark:text-blue-100"
                                    : "text-foreground"
                                }`}
                              >
                                {isOwnComment ? "Siz" : comment.user_name}
                              </p>
                              <p
                                className={`text-sm break-words mt-1 ${
                                  isOwnComment
                                    ? "text-blue-900 dark:text-blue-100"
                                    : "text-foreground"
                                }`}
                              >
                                {comment.comment}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                      {hasMoreComments && (
                        <div className="flex justify-center pt-2">
                          <Button
                            onClick={() => setDisplayCount((prev) => prev + 5)}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            <ChevronDown className="h-3 w-3 mr-1" />
                            Ko'proq yuklash
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 border-t pt-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddComment();
                  }}
                  placeholder="Izoh qoldiring..."
                  className="flex-1 px-3 py-2 text-sm border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  onClick={handleAddComment}
                  size="sm"
                  disabled={posting}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {posting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
