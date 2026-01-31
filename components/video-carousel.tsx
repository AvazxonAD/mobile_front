"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { BASE_URL } from "../lib/API";

interface Video {
  id: number;
  title: string;
  file_url: string;
  size: number;
  created_at: string;
}

export default function VideoCarousel() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          BASE_URL + "/videos?active=true&page=1&limit=20"
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) setVideos(data.data);
        else setError("Videolarni yuklashda xatolik");
      } catch {
        setError("Tarmoq xatosi yuz berdi");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((p) => (p + 1) % videos.length);
  }, [videos.length]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    isPlaying ? video.play().catch(() => {}) : video.pause();
  }, [isPlaying, isMuted, currentIndex]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const t = () => setProgress((v.currentTime / v.duration) * 100);
    v.addEventListener("timeupdate", t);
    return () => v.removeEventListener("timeupdate", t);
  }, []);

  if (loading)
    return (
      <div className="w-full h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
      </div>
    );

  if (error || videos.length === 0)
    return (
      <div className="w-full h-[70vh] flex items-center justify-center text-muted-foreground">
        {error || "Videolar topilmadi"}
      </div>
    );

  const video = videos[currentIndex];

  return (
    <div className="flex flex-col items-center w-full  bg-background ">
      <div className="relative w-full max-w-md h-[60vh] rounded-2xl overflow-hidden shadow-lg bg-black">
        <video
          key={video.id}
          ref={videoRef}
          autoPlay
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
          onEnded={goToNext}
        >
          <source src={video.file_url} type="video/mp4" />
        </video>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />

        {/* Title and top info */}
        <div className="absolute top-3 left-4 right-4 text-white">
          <h2 className="text-sm font-medium line-clamp-2">{video.title}</h2>
          <p className="text-xs opacity-70 mt-1">
            {(currentIndex + 1).toString().padStart(2, "0")} /{" "}
            {videos.length.toString().padStart(2, "0")}
          </p>
        </div>

        {/* Play / Mute Controls */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full text-white backdrop-blur-md transition"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <div className="flex-1 mx-3 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white"
              style={{ width: `${progress}%` }}
            />
          </div>
          <button
            onClick={() => setIsMuted((p) => !p)}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full text-white backdrop-blur-md transition"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {videos.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              i === currentIndex ? "bg-primary w-4" : "bg-yellow-200"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
