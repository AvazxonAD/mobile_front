"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type User,
  type AuthState,
  type AuthResult,
  signIn,
  signUp,
  signOut,
  updateUser as updateUserApi,
  refreshUserData,
} from "../lib/auth";
import { useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthStore extends AuthState {
  token: string | null;
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (
    email: string,
    password: string,
    name: string,
    phone?: string,
    avatar?: File | null
  ) => Promise<User | null>;
  signOut: () => Promise<void>;
  updateUser: (
    id: string,
    updates: {
      email?: string;
      name?: string;
      phone?: string;
      password?: string;
      avatar?: File | null;
    }
  ) => Promise<AuthResult>;
  refreshUser: () => Promise<void>;
  getAvatarUrl: (avatarPath: string | null) => string;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // Avatar URL ni to'g'ri formatda qaytarish uchun helper
      getAvatarUrl: (avatarPath: string | null) => {
        if (!avatarPath) return "/placeholder-user.jpg";
        if (avatarPath.startsWith("http")) return avatarPath;
        return `${API_URL}${avatarPath}`;
      },

      signIn: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const user = await signIn(email, password);
          if (user) {
            // Avatar URL ni to'g'rilash
            if (user.avatar) {
              user.avatar = get().getAvatarUrl(user.avatar);
            }
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            return user;
          }
          set({ isLoading: false });
          throw new Error("Invalid credentials");
        } catch (error) {
          set({ isLoading: false });
          const errorMessage =
            error instanceof Error ? error.message : "Login failed";
          throw new Error(errorMessage);
        }
      },

      signUp: async (
        email: string,
        password: string,
        name: string,
        phone?: string,
        avatar?: File | null
      ) => {
        set({ isLoading: true });
        try {
          const user = await signUp(
            email,
            password,
            name,
            phone || "+998",
            avatar || undefined
          );
          if (user) {
            // Avatar URL ni to'g'rilash
            if (user.avatar) {
              user.avatar = get().getAvatarUrl(user.avatar);
            }
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            return user;
          }
          set({ isLoading: false });
          throw new Error("Registration failed");
        } catch (error) {
          set({ isLoading: false });
          const errorMessage =
            error instanceof Error ? error.message : "Registration failed";
          throw new Error(errorMessage);
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          await signOut();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          console.error("Logout error:", error);
          set({ isLoading: false });
        }
      },

      updateUser: async (id: string, updates) => {
        set({ isLoading: true });
        try {
          // Convert null avatar to undefined for API compatibility
          const apiUpdates = {
            ...updates,
            avatar: updates.avatar || undefined,
          };

          const result = await updateUserApi(id, apiUpdates);
          if (result.user) {
            if (result.user.avatar) {
              result.user.avatar = get().getAvatarUrl(result.user.avatar);
            }
            set({
              user: result.user,
              isAuthenticated: true,
            });
          }
          set({ isLoading: false });
          return result;
        } catch (error) {
          console.error("Update user error:", error);
          set({ isLoading: false });
          return {
            user: null,
            error: {
              message: "Failed to update user",
              code: "auth/update-failed",
            },
          };
        }
      },

      refreshUser: async () => {
        try {
          const user = await refreshUserData();
          if (user) {
            // Avatar URL ni to'g'rilash
            if (user.avatar) {
              user.avatar = get().getAvatarUrl(user.avatar);
            }
            set({ user, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          console.error("Refresh user error:", error);
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook for auto-refresh functionality
export const useAuthRefresh = () => {
  const { refreshUser } = useAuth();

  useEffect(() => {
    // Initial refresh
    refreshUser();

    // Set up interval for periodic refresh (every 5 minutes)
    const interval = setInterval(refreshUser, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshUser]);
};
