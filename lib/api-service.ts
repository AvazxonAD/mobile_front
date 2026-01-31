import { BASE_URL } from "./API";

const API_BASE_URL = BASE_URL;

// Get token from localStorage
function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

// Get headers with authorization
function getHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  avatar: string;
  created_at: string;
  updated_at: string;
  file: string;
}

export interface Chat {
  id: number;
  sender_id: number;
  receiver_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  sender_email: string;
  sender_name: string;
  receiver_email: string;
  receiver_name: string;
  user_email: string;
  user_name: string;
}

export interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ChatDetail extends Chat {
  messages?: Message[];
}

// Fetch all users
export async function fetchUsers(page = 1, limit = 1000): Promise<User[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) throw new Error("Failed to fetch users");

    const data = await response.json();
    const allUsers = data.data || [];
    const currentId = getCurrentUserId();

    // Filter out current user from the list
    return allUsers.filter((user: User) => user.id !== currentId);
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Create a new chat
export async function createChat(receiverId: number): Promise<Chat | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/chats`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ receiver_id: receiverId }),
    });

    if (!response.ok) throw new Error("Failed to create chat");

    const data = await response.json();
    return data.message || null;
  } catch (error) {
    console.error("Error creating chat:", error);
    return null;
  }
}

// Fetch all chats for current user
export async function fetchChats(): Promise<Chat[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/chats`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch chats");

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
}

// Fetch messages for a specific chat
export async function fetchMessages(chatId: number): Promise<Message[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/messages?chat_id=${chatId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch messages");

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

// Send a message
export async function sendMessage(
  chatId: number,
  content: string
): Promise<Message | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        chat_id: chatId,
        content: content,
      }),
    });

    if (!response.ok) throw new Error("Failed to send message");

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
}

// Get current user from token
export function getCurrentUserId(): number | null {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || null;
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
}
