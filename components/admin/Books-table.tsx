"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { PlusCircle, Download, Archive, MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { useToast } from "../../hooks/use-toast";

// LIB TYPES
import {
  Book,
  createBook,
  deleteBook,
  getBookFile,
  getBookImage,
  getBooks,
} from "../../lib/books";

interface BookForm {
  title: string;
  description: string;
  image: File | null;
  pdf: File | null;
}

export function BooksTable() {
  const [books, setBooks] = useState<Book[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [form, setForm] = useState<BookForm>({
    title: "",
    description: "",
    image: null,
    pdf: null,
  });

  const { toast } = useToast();

  useEffect(() => {
    async function loadBooks() {
      try {
        const list: Book[] = await getBooks();
        setBooks(list);
      } catch (error) {
        console.error("📚 Kitoblarni yuklashda xatolik:", error);
      }
    }
    loadBooks();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteBook(id);
    window.location.reload();
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.image || !form.pdf) {
      toast({
        title: "Xatolik",
        description: "Barcha maydonlarni to‘ldiring!",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await createBook({
        title: form.title,
        description: form.description,
        image: form.image,
        pdf: form.pdf,
      });

      setOpen(false);
      setForm({ title: "", description: "", image: null, pdf: null });
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>📚 Kitoblar</CardTitle>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                Kitob
                <PlusCircle className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Yangi kitob qo‘shish</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreate} className="space-y-3">
                <Input
                  placeholder="Kitob nomi"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                />

                <Input
                  placeholder="Kitob tavsifi"
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                />

                <div>
                  <label className="text-sm font-medium">Rasm</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        image: e.target.files?.[0] ?? null,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">PDF fayl</label>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        pdf: e.target.files?.[0] ?? null,
                      }))
                    }
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                      Yuklanmoqda...
                    </div>
                  ) : (
                    "Qo‘shish"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kitob</TableHead>
                <TableHead>Hajmi</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {books.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <img
                        src={String(getBookImage(item.image_url))}
                        className="h-12 w-10 rounded object-cover"
                        alt=""
                      />
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    {(Number(item.file_size) / 1024 / 1024).toFixed(1)} MB
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="start">
                        <DropdownMenuItem
                          onClick={() =>
                            window.open(String(getBookFile(item.file_name)))
                          }
                        >
                          <Download className="mr-2 text-green-500 h-4 w-4" />
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleDelete(item.id)}
                        >
                          <Archive className="mr-2 text-red-500 h-4 w-4" />
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
  );
}
