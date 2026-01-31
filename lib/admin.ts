import { BASE_URL } from "./API";

const API_BASE_URL = BASE_URL;

interface ApiResponse<T> {
  success: boolean;
  message: T;
  data: string;
  timestamp: string;
  meta?: {
    page: number;
    limit: number;
    count: number;
    total_pages: number;
    next_page: number | null;
    back_page: number | null;
    offset: number;
  };
}

interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  avatar: string;
  created_at: string;
  updated_at: string;
  password: string;
  file: string;
}

export async function fetchUsers(
  page = 1,
  limit = 20
): Promise<{ users: any; meta: any }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users?page=${page}&limit=${limit}`
    );
    const data: ApiResponse<any> = await response.json();

    if (data.success) {
      return {
        users: data.data,
        meta: data.meta,
      };
    }
    throw new Error("Failed to fetch users");
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function createUser(userData: Partial<User>): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data: ApiResponse<User> = await response.json();
    if (data.success) {
      return data.message;
    }
    throw new Error("Failed to create user");
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUser(
  id: number,
  userData: Partial<User>
): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data: ApiResponse<User> = await response.json();
    if (data.success) {
      return data.message;
    }
    throw new Error("Failed to update user");
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
    });
    const data: ApiResponse<any> = await response.json();
    if (!data.success) {
      throw new Error("Failed to delete user");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalChallenges: number;
  completedChallenges: number;
  totalKnowledgeItems: number;
  totalArticleSubmissions: number;
  averageEngagement: number;
}

export interface UserManagement {
  id: string;
  name: string;
  email: string;
  level: number;
  totalPoints: number;
  streak: number;
  joinedAt: Date;
  lastActive: Date;
  status: "active" | "inactive" | "suspended";
}

export interface ContentManagement {
  id: string;
  title: string;
  type: "challenge" | "knowledge" | "article";
  author: string;
  status: "draft" | "published" | "archived";
  createdAt: Date;
  views: number;
  engagement: number;
}

// Mock data for admin dashboard
export const getAdminStats = (): AdminStats => {
  return {
    totalUsers: 1247,
    activeUsers: 892,
    totalChallenges: 365,
    completedChallenges: 12847,
    totalKnowledgeItems: 156,
    totalArticleSubmissions: 89,
    averageEngagement: 78.5,
  };
};

export const getContentItems = (): ContentManagement[] => {
  return [
    {
      id: "1",
      title: "Morning Mindfulness Challenge",
      type: "challenge",
      author: "Admin",
      status: "published",
      createdAt: new Date("2024-03-01"),
      views: 1247,
      engagement: 85.2,
    },
    {
      id: "2",
      title: "Building Emotional Intelligence",
      type: "knowledge",
      author: "Dr. Smith",
      status: "published",
      createdAt: new Date("2024-02-28"),
      views: 892,
      engagement: 92.1,
    },
    {
      id: "3",
      title: "My Journey to Self-Discovery",
      type: "article",
      author: "User123",
      status: "draft",
      createdAt: new Date("2024-03-05"),
      views: 0,
      engagement: 0,
    },
  ];
};

export const updateUserStatus = async (
  userId: string,
  status: UserManagement["status"]
): Promise<void> => {
  // Mock API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Updated user ${userId} status to ${status}`);
};

export const updateContentStatus = async (
  contentId: string,
  status: ContentManagement["status"]
): Promise<void> => {
  // Mock API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Updated content ${contentId} status to ${status}`);
};
