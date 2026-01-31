import { BASE_URL } from "./API";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  meta: null | Record<string, unknown>;
}

function getAuthToken(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || "";
  }
  return "";
}

function getHeaders(): Record<string, string> {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function getChallenges() {
  try {
    const response = await fetch(BASE_URL + "/challenges", {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<unknown> = await response.json();
    console.log("[v0] Challenges fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("[v0] Failed to fetch challenges:", error);
    throw error;
  }
}

export async function submitChallenge(
  response: string,
  time: string,
  challengeId: number
) {
  try {
    const response_ = await fetch(BASE_URL + "/essay", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        response,
        time,
        challenge_id: challengeId,
      }),
    });

    if (!response_.ok) {
      throw new Error(`HTTP error! status: ${response_.status}`);
    }

    const data: ApiResponse<unknown> = await response_.json();
    console.log("[v0] Challenge submitted successfully:", data);
    return data;
  } catch (error) {
    console.error("[v0] Failed to submit challenge:", error);
    throw error;
  }
}

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}
