export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "member" | "viewer";
  clientAccess: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  client?: string;
}
