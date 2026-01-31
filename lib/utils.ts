import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeApiBaseUrl(url: string): string {
  return url?.replace("http://raqamli-manaviyat.uz/api/users/file/", "") || "";
}

export function addApiBaseUrl(path: string): string {
  if (!path) return "";
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `http://raqamli-manaviyat.uz/api/${cleanPath}`;
}

export function removeApiBaseUrll(url: string): string {
  return url?.replace("http://raqamli-manaviyat.uz/api/users/file/", "") || "";
}

export function removeBookUrl(url: string): string {
  return url?.replace("https://mobile-production-732f.up.railway.app/api/book/file/", "") || "";
}

export function removeUndefined(url: string): string {
  return url?.replace("undefined", "") || "";
}

export function formatToDDMMYYYY(dateString: string) {
  const d = new Date(dateString);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear(); // bu yerda hozirgi timestampdan olinadigan yil (2025)
  return `${day}.${month}.${year}`;
}
