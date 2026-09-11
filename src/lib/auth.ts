import { useSyncExternalStore } from "react";
import { User, AuthResponse, LoginCredentials } from "@/types/auth";

const TOKEN_STORAGE_KEY = "v2001_auth_token";
const USER_STORAGE_KEY = "v2001_auth_user";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  window.dispatchEvent(new Event("storage"));
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  window.dispatchEvent(new Event("storage"));
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function useIsAuthenticated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => Boolean(getAuthToken()),
    () => false
  );
}

export function useCurrentUser(): User | null {
  const raw = useSyncExternalStore(
    subscribe,
    () => (typeof window !== "undefined" ? localStorage.getItem(USER_STORAGE_KEY) : null),
    () => null
  );

  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

/**
 * Boilerplate login function.
 * Ready to be connected to Better Auth / your backend endpoint in the future.
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  // Simulate authentication latency for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 600));

  const mockUser: User = {
    id: "usr_placeholder_123",
    email: credentials.email,
    name: credentials.email.split("@")[0] || "Administrator",
    role: "admin",
    clientAccess: credentials.client ? [credentials.client] : ["*"],
  };

  const mockResponse: AuthResponse = {
    user: mockUser,
    token: `jwt_placeholder_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    expiresAt: new Date(Date.now() + 24 * 60 * 1000).toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_STORAGE_KEY, mockResponse.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
    window.dispatchEvent(new Event("storage"));
  }

  return mockResponse;
}

export function logout(): void {
  clearAuthToken();
}
