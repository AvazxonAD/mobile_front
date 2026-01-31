"use client";

import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { KnowledgeCard } from "./knowledge-card";
import {
  Search,
  BookOpen,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "../../components/ui/button";
import { BASE_URL } from "../../lib/API";

interface Book {
  id: number;
  title: string;
  description: string;
  image: string;
  pdfUrl?: string;
}

export function KnowledgeHub() {
  const t = useTranslations("knowledge_hub");
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 20; // har bir sahifadagi kitoblar soni

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(BASE_URL + `/books?page=${page}&limit=${limit}`);

      if (!res.ok)
        throw new Error("Serverdan ma’lumot olishda xatolik yuz berdi");
      const data = await res.json();
      
      // Agar API shunday formatda bo‘lsa: { books: [...], total: 120 }
      const booksData = data.data || data.items || data || [];
      setBooks(booksData);
      console.log(booksData);
      const totalItems = data.meta.total_pages || booksData.length;
      setTotalPages(Math.ceil(totalItems / limit));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page]);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenPdf = (book: Book) => {
    if (book.pdfUrl) {
      window.open(book.pdfUrl, "_blank");
    }
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
        </div>
        <p className="text-sm text-muted-foreground text-pretty px-4 leading-relaxed">
          {t("description")}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("search_placeholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-6 w-6 text-primary" />
        </div>
      )}

      {/* Error */}
      {error && <p className="text-center text-red-500 py-6">{error}</p>}

      {/* Books Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredBooks.map((book: any) => (
            <KnowledgeCard
              key={book.id}
              item={book}
              onOpenPdf={() => handleOpenPdf(book)}
            />
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && !error && filteredBooks.length === 0 && (
        <p className="text-center text-muted-foreground py-6">No result</p>
      )}

      {/* Pagination */}
      {!loading && !error && filteredBooks.length > 0 && (
        <div className="flex justify-center items-center gap-4 py-6">
          <Button
            onClick={handlePrevPage}
            disabled={page === 1}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
          </Button>

          <span className="text-sm text-muted-foreground">
            page {page} / {totalPages}
          </span>

          <Button
            onClick={handleNextPage}
            disabled={page === totalPages}
            variant="outline"
            size="sm"
          >
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
