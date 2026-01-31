"use client";

import { useState, useEffect } from "react";
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useToast } from "../../hooks/use-toast";
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../../lib/admin";
import { Spinner } from "../ui/spinner";
import { BASE_URL } from "../../lib/API";

interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  avatar: string;
  created_at: string;
  updated_at: string;
  file: string;
}

interface Meta {
  page: number;
  limit: number;
  count: number;
  total_pages: number;
  next_page: number | null;
  back_page: number | null;
}

export function UserManagementReal() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage]);

  const loadUsers = async (page: number) => {
    try {
      setLoading(true);
      const { users: fetchedUsers, meta: fetchedMeta } = await fetchUsers(
        page,
        20
      );
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
      setMeta(fetchedMeta);
    } catch (error) {
      toast({
        title: "Xato",
        description: "Foydalanuvchilarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.phone.includes(query)
    );
    setFilteredUsers(filtered);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Rostan ham o'chirmoqchimisiz?")) {
      try {
        await deleteUser(id);
        toast({
          title: "Muvaffaqiyatli",
          description: "Foydalanuvchi o'chirildi",
        });
        loadUsers(currentPage);
      } catch (error) {
        toast({
          title: "Xato",
          description: "Foydalanuvchini o'chirishda xatolik yuz berdi",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
        toast({
          title: "Muvaffaqiyatli",
          description: "Foydalanuvchi tahrirlandi",
        });
      } else {
        await createUser(formData);
        toast({
          title: "Muvaffaqiyatli",
          description: "Yangi foydalanuvchi qo'shildi",
        });
      }
      setIsDialogOpen(false);
      setEditingUser(null);
      loadUsers(currentPage);
    } catch (error) {
      toast({
        title: "Xato",
        description: "Saqlashda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  if (loading && users.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">Foydalanuvchilar</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Qidirish..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <UserDialog
              user={null}
              onSave={handleSave}
              isOpen={isDialogOpen && !editingUser}
              setIsOpen={(open) => !editingUser && setIsDialogOpen(open)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Ismi</TableHead>
                <TableHead className="hidden sm:table-cell min-w-[180px]">
                  Email
                </TableHead>
                <TableHead className="hidden md:table-cell min-w-[120px]">
                  Telefon
                </TableHead>
                <TableHead className="hidden lg:table-cell min-w-[150px]">
                  Yaratilgan
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            BASE_URL + "/users/file/" + user.avatar ||
                            "/user.png"
                          }
                          alt={user.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <div className="font-medium truncate">
                            {user.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate sm:hidden">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell truncate">
                      {user.email}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {user.phone}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">
                      {new Date(user.created_at).toLocaleDateString("uz-UZ")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Edit className="mr-2 text-blue-500 h-4 w-4" />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 text-red-600 h-4 w-4" />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Foydalanuvchi topilmadi
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {meta && meta.total_pages > 1 && (
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={!meta.back_page}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Oldingi</span>
            </Button>

            <div className="text-sm text-muted-foreground">
              Sahifa {meta.page} / {meta.total_pages}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((p) => Math.min(meta.total_pages, p + 1))
              }
              disabled={!meta.next_page}
            >
              <span className="hidden sm:inline mr-1">Keyingi</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>

      {/* Edit Dialog */}
      {editingUser && (
        <UserDialog
          user={editingUser}
          onSave={handleSave}
          isOpen={isDialogOpen && !!editingUser}
          setIsOpen={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingUser(null);
          }}
        />
      )}
    </Card>
  );
}

function UserDialog({
  user,
  onSave,
  isOpen,
  setIsOpen,
}: {
  user: User | null;
  onSave: (data: any) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    confirm_password: "",
  });
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: "",
        confirm_password: "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
      });
    }
    setPasswordError("");
  }, [user, isOpen]);

  const handleSave = () => {
    if (user) {
      // Edit mode - password is optional
      if (formData.password || formData.confirm_password) {
        if (formData.password !== formData.confirm_password) {
          setPasswordError("Parollar mos kelmadi");
          return;
        }
        if (formData.password.length < 6) {
          setPasswordError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
          return;
        }
      }
    } else {
      // Create mode - password is required
      if (!formData.password) {
        setPasswordError("Parol talab qilinadi");
        return;
      }
      if (formData.password !== formData.confirm_password) {
        setPasswordError("Parollar mos kelmadi");
        return;
      }
      if (formData.password.length < 6) {
        setPasswordError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
        return;
      }
    }

    const dataToSave = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    };

    // Only include password if provided
    if (formData.password) {
      Object.assign(dataToSave, { password: formData.password });
    }

    onSave(dataToSave);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {!user && (
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Yangi foydalanuvchi</span>
            <span className="sm:hidden">Qo'sh</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {user ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi"}
          </DialogTitle>
          <DialogDescription>
            Foydalanuvchi ma'lumotlarini kiriting
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Ismi"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <Input
            placeholder="Telefon"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          {/* Added password fields */}
          <div className="space-y-2 border-t pt-4">
            <label className="text-sm font-medium">
              Parol {!user && <span className="text-red-500">*</span>}
            </label>
            <Input
              type="password"
              placeholder={
                user ? "Parolni almashtirish uchun kiriting" : "Yangi parol"
              }
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setPasswordError("");
              }}
            />
            <Input
              type="password"
              placeholder="Parolni tasdiqlang"
              value={formData.confirm_password}
              onChange={(e) => {
                setFormData({ ...formData, confirm_password: e.target.value });
                setPasswordError("");
              }}
            />
            {passwordError && (
              <p className="text-xs text-red-500">{passwordError}</p>
            )}
            {user && (
              <p className="text-xs text-muted-foreground">
                Bo'sh qoldirilsa parol o'zgartirilmaydi
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Bekor qilish
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Saqlash
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
