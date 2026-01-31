import { BASE_URL } from "./API";
import axios from "axios";

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  avatar: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_admin: boolean;
  streak: number;
  totalPoints: number;
  level: number;
  badges: string[];
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
  timestamp: string;
  meta: null;
}

export interface AuthError {
  message: string;
  code: string;
}

export interface AuthResult {
  user: User | null;
  error: AuthError | null;
}

const API_URL = BASE_URL;

if (!API_URL) {
  console.error("API_URL is not configured in environment variables");
}

// Token management
const setAuthToken = (token: string) => {
  document.cookie = `auth_token=${token}; path=/; max-age=2592000; SameSite=Strict`; // 30 days expiry
};

const getAuthToken = () => {
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("auth_token=")
  );
  return tokenCookie ? tokenCookie.split("=")[1] : null;
};

const removeAuthToken = () => {
  document.cookie =
    "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

// API requestlar uchun helper funksiya
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    if (!API_URL) {
      throw new Error("API_URL is not configured in environment variables");
    }

    const token = getAuthToken();
    const isFormData = options.body instanceof FormData;

    // FormData uchun Content-Type headerini qo'shmaslik
    const defaultHeaders: HeadersInit = isFormData
      ? {}
      : { "Content-Type": "application/json" };

    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    const fullUrl = `${API_URL}${endpoint}`;
    console.log("Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    // Response type va status ni log qilish
    console.log("Response status:", response.status);
    console.log("Response type:", response.headers.get("content-type"));

    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error("Failed to parse response as JSON:", error);
      throw new Error("Invalid response format from server");
    }

    if (!response.ok) {
      const errorData = data;
      throw new Error(errorData.message || "An error occurred");
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};


export const signIn = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const response: any = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
      // Save userId in localStorage
      localStorage.setItem("userId", response.data.user.id.toString());
      localStorage.setItem("token", response.data.token.toString());
      return {
        ...response.data.user,
      };
    }

    return null;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};




export const signUp = async (
  email: string,
  password: string,
  name: string,
  phone: string,
  avatar?: File
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("phone", phone);
    if (avatar) formData.append("avatar", avatar);

    console.log("Sending registration data:", { email, name, phone });

    const response: any = await apiRequest("/auth/register", {
      method: "POST",
      body: formData,
    });

    if (!response || !response.success) {
      throw new Error(
        response?.message || "Ro‘yxatdan o‘tishda xatolik yuz berdi"
      );
    }

    // ✅ Ro‘yxatdan o‘tishdan so‘ng darhol login
    const loginResponse: any = await signIn(email, password);

    // ✅ Login qilingan datani qaytaramiz
    console.log(loginResponse);

    return loginResponse;
  } catch (error) {
    console.error("Register error details:", error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await apiRequest("/auth/logout", {
      method: "POST",
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    removeAuthToken();
  }
};

export const updateUser = async (
  id: string,
  data: {
    email?: string;
    name?: string;
    phone?: string;
    password?: string;
    avatar?: File;
  }
): Promise<AuthResult> => {
  try {
    const formData = new FormData();

    // Only append non-empty values
    if (data.email) formData.append("email", data.email);
    if (data.name) formData.append("name", data.name);
    if (data.phone) formData.append("phone", data.phone);
    // Only append password if it's actually provided and not empty
    if (data.password && data.password.trim() !== "") {
      formData.append("password", data.password);
    }
    if (data.avatar) formData.append("avatar", data.avatar);

    const response: AuthResponse = await apiRequest(`/users/${id}`, {
      method: "PUT",
      body: formData,
      headers: {},
    });

    if (response.success) {
      return {
        user: response.data.user,
        error: null,
      };
    }

    return {
      user: null,
      error: {
        message: response.message,
        code: "auth/update-failed",
      },
    };
  } catch (error) {
    console.error("Update user error:", error);
    return {
      user: null,
      error: {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        code: "auth/unknown",
      },
    };
  }
};

// User ma'lumotlarini yangilash uchun helper funksiya
export const refreshUserData = async (): Promise<User | null> => {
  try {
    // Parse userId from token or get from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No user ID found");
      return null;
    }

    const response: any = await apiRequest(`/auth/me`, {
      method: "GET",
    });

    if (response.success) {
      return {
        ...response.data,
      };
    }

    return null;
  } catch (error) {
    console.error("Refresh user data error:", error);
    return null;
  }
};
