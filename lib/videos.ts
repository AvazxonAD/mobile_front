import { BASE_URL } from "./API"

const API_URL = BASE_URL

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || localStorage.getItem("auth_token")
  }
  return null
}

const getHeaders = () => {
  const token = getToken()
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export interface Video {
  id: number
  title: string
  file: string
  file_url: string
  size: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface VideosMeta {
  page: number
  limit: number
  count: number
  total_pages: number
  next_page: number | null
  back_page: number | null
}

export async function fetchVideos(page = 1, limit = 20) {
  const response = await fetch(`${API_URL}/videos?page=${page}&limit=${limit}`, {
    headers: getHeaders(),
  })
  const data = await response.json()
  return {
    videos: data.data || [],
    meta: data.meta || { page, limit, count: 0, total_pages: 0 },
  }
}

export async function uploadVideo(formData: FormData) {
  const response = await fetch(`${API_URL}/videos`, {
    method: "POST",
    headers: {
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
    },
    body: formData,
  })
  if (!response.ok) throw new Error("Failed to upload video")
  return response.json()
}

export async function updateVideoStatus(id: number, active: boolean) {
  const response = await fetch(`${API_URL}/videos/status/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders(),
    },
    body: JSON.stringify({ active }),
  })
  if (!response.ok) throw new Error("Failed to update video status")
  return response.json()
}

export async function deleteVideo(id: number) {
  const response = await fetch(`${API_URL}/videos/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  })
  if (!response.ok) throw new Error("Failed to delete video")
  return response.json()
}
