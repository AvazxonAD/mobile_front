import { BASE_URL } from "./API";

const API_BASE_URL = BASE_URL + "/articles";

export interface ArticleAuthor {
  id: string;
  name: string;
  email: string;
}

export interface ArticleSubmission {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status:
    | "draft"
    | "submitted"
    | "under_review"
    | "approved"
    | "published"
    | "rejected";
  author: ArticleAuthor;
  readingTime: number;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  submittedAt: Date;
  publishedAt?: Date;
}

export const articleCategories = [
  { id: "technology", name: "Technology", icon: "💻" },
  { id: "business", name: "Business", icon: "💼" },
  { id: "lifestyle", name: "Lifestyle", icon: "🎨" },
  { id: "education", name: "Education", icon: "📚" },
  { id: "health", name: "Health", icon: "⚕️" },
  { id: "travel", name: "Travel", icon: "✈️" },
];

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(content: string, length = 150): string {
  return (
    content.substring(0, length).trim() + (content.length > length ? "..." : "")
  );
}

/**
 * Get all articles with pagination
 */
export async function getArticles(page = 1, limit = 20) {
  try {
    const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`);
    const data = await response.json();

    if (data.success) {
      return {
        articles: data.data || [],
        meta: data.meta,
      };
    }
    throw new Error(data.message || "Failed to fetch articles");
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
}

/**
 * Get user's articles
 */
export async function getUserArticles(userId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}?userId=${userId}`);
    const data = await response.json();

    if (data.success) {
      return data.data || [];
    }
    throw new Error(data.message || "Failed to fetch user articles");
  } catch (error) {
    console.error("Error fetching user articles:", error);
    throw error;
  }
}

/**
 * Get single article by ID
 */
export async function getArticleById(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const data = await response.json();

    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || "Failed to fetch article");
  } catch (error) {
    console.error("Error fetching article:", error);
    throw error;
  }
}

/**
 * Create or update article (POST)
 */
export async function submitArticle(article: any) {
  try {
    const payload = {
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      category: article.category,
    };

    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "*/*",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || "Failed to submit article");
  } catch (error) {
    console.error("Error submitting article:", error);
    throw error;
  }
}

/**
 * Update existing article (PUT)
 */
export async function updateArticle(
  id: string,
  article: Partial<ArticleSubmission>
) {
  try {
    const payload: any = {};

    if (article.title) payload.title = article.title;
    if (article.content) payload.content = article.content;
    if (article.excerpt) payload.excerpt = article.excerpt;
    if (article.category) payload.category = article.category;
    if (article.tags) payload.tags = article.tags;
    if (article.status) payload.status = article.status;

    const token = getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "*/*",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || "Failed to update article");
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
}

/**
 * Delete article (DELETE)
 */
export async function deleteArticle(id: string) {
  try {
    const token = getAuthToken();
    const headers: HeadersInit = {
      Accept: "*/*",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();

    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || "Failed to delete article");
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
}
