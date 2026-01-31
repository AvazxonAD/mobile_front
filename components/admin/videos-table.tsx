"use client";

import { useState, useEffect } from "react";
import {
  fetchVideos,
  uploadVideo,
  updateVideoStatus,
  deleteVideo,
  type Video,
} from "../../lib/videos";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Spinner } from "../ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Play, Trash2, MoreVertical, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

export function VideosTable() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  useEffect(() => {
    loadVideos();
  }, [page]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const { videos: data, meta } = await fetchVideos(page, 20);
      setVideos(data);
      setTotalPages(meta.total_pages || 1);
    } catch (error) {
      console.error("Error loading videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile || !uploadTitle.trim()) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", uploadTitle.trim());

      await uploadVideo(formData);
      await loadVideos();
      setShowUploadModal(false);
      setUploadTitle("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleToggleStatus = async (video: Video) => {
    try {
      await updateVideoStatus(video.id, !video.active);
      await loadVideos();
    } catch (error) {
      console.error("Error updating video status:", error);
    }
  };

  const handleDelete = async () => {
    if (!videoToDelete) return;
    try {
      await deleteVideo(videoToDelete.id);
      await loadVideos();

      setVideoToDelete(null);
      router.refresh();
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const handlePlayVideo = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <div className="flex gap-2 flex-col sm:flex-row">
        <Button
          onClick={() => setShowUploadModal(true)}
          disabled={uploading}
          className="w-full sm:w-auto"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Yuklanmoqda..." : "Video yuklash"}
        </Button>

        <Input
          placeholder="Video nomi bo'yicha qidirish..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Videos Grid */}
      <div className="grid gap-3 sm:gap-4">
        {filteredVideos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Videolar topilmadi
          </div>
        ) : (
          filteredVideos.map((video) => (
            <div
              key={video.id}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-accent transition"
            >
              {/* Video Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <Checkbox
                    checked={video.active}
                    onCheckedChange={() => handleToggleStatus(video)}
                    aria-label={`${video.title} status`}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{video.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {(video.size / 1024 / 1024).toFixed(2)} MB •{" "}
                      {new Date(video.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 items-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePlayVideo(video.file_url)}
                >
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Ko'rish</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setVideoToDelete(video)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      O'chirish
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 justify-center mt-4">
          <Button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            variant="outline"
          >
            Oldingi
          </Button>
          <span className="flex items-center px-3 text-sm">
            {page} / {totalPages}
          </span>
          <Button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            variant="outline"
          >
            Keyingi
          </Button>
        </div>
      )}

      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Video yuklash</DialogTitle>
            <DialogDescription>
              Video nomi va faylni tanlang, keyin yuklang
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Video nomi
              </label>
              <Input
                id="title"
                placeholder="Masalan: O'zbek tilida dars"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                disabled={uploading}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="file" className="text-sm font-medium">
                Video fayli
              </label>
              <Input
                id="file"
                type="file"
                accept="video/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                disabled={uploading}
              />
              {selectedFile && (
                <p className="text-xs text-muted-foreground">
                  Tanlangan fayl: {selectedFile.name} (
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUploadModal(false)}
              disabled={uploading}
            >
              Bekor qilish
            </Button>
            <Button
              onClick={handleUploadSubmit}
              disabled={!selectedFile || !uploadTitle.trim() || uploading}
            >
              {uploading ? "Yuklanmoqda..." : "Yuklash"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!videoToDelete}
        onOpenChange={(open) => !open && setVideoToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Videoni o'chirishni tasdiqlang</AlertDialogTitle>
            <AlertDialogDescription>
              "{videoToDelete?.title}" videosi o'chiriladi. Bu amalni qaytarib
              bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive"
            >
              O'chirish
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
