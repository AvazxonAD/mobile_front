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
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export interface User {
  id: number
  email: string
  name: string
  phone: string
  avatar: string
  created_at: string
  updated_at: string
  file: string
}

export interface Meta {
  page: number
  limit: number
  count: number
  total_pages: number
  next_page: number | null
  back_page: number | null
}

export interface AdminStats {
  total_users: number
  total_books: number
  total_challenges: number
}

export interface ContentManagement {
  id: string
  title: string
  author: string
  views: number
  status: "published" | "draft" | "archived"
  type: "challenge" | "knowledge" | "article"
}

export interface Challenge {
  id: number
  title: string
  description: string
  points: number
  estimated_time: string
  instructions: string[]
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// User Management
export async function fetchUsers(page: number, limit: number) {
  const response = await fetch(`${API_URL}/users?page=${page}&limit=${limit}`, {
    headers: getHeaders(),
  })
  const data = await response.json()
  return {
    users: data.data || [],
    meta: data.meta || {},
  }
}

export async function createUser(formData: any) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(formData),
  })
  if (!response.ok) throw new Error("Failed to create user")
  return response.json()
}

export async function updateUser(id: number, formData: any) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(formData),
  })
  if (!response.ok) throw new Error("Failed to update user")
  return response.json()
}

export async function deleteUser(id: number) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  })
  if (!response.ok) throw new Error("Failed to delete user")
  return response.json()
}

// Challenge Management
export async function fetchChallenges(page = 1, limit = 20) {
  const response = await fetch(`${API_URL}/challenges?page=${page}&limit=${limit}`, {
    headers: getHeaders(),
  })
  const data = await response.json()
  return {
    challenges: data.data || [],
    meta: data.meta || { page, limit, count: 0, total_pages: 0 },
  }
}

export async function createChallenge(formData: Partial<Challenge>) {
  const response = await fetch(`${API_URL}/challenges`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(formData),
  })
  if (!response.ok) throw new Error("Failed to create challenge")
  return response.json()
}

export async function updateChallenge(id: number, formData: Partial<Challenge>) {
  const response = await fetch(`${API_URL}/challenges/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(formData),
  })
  if (!response.ok) throw new Error("Failed to update challenge")
  return response.json()
}

export async function deleteChallenge(id: number) {
  const response = await fetch(`${API_URL}/challenges/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  })
  if (!response.ok) throw new Error("Failed to delete challenge")
  return response.json()
}

// Admin Stats
export function getAdminStats(): AdminStats {
  return {
    total_users: 1250,
    total_books: 45,
    total_challenges: 0,
  }
}

export async function getContentItems() {
  return []
}

export async function updateContentStatus(contentId: string, status: string) {
  return true
}
