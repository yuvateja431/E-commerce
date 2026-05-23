export type Role = "USER" | "ADMIN" | "MANAGER";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  isEmailVerified: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
