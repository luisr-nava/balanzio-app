export interface LoginResponse {
  token: string;
  user: User;
  ownerId: string;
  appKey: string;
  plan: string;
  subscriptionStatus: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  appKey: string;
  lastLogin: string;
  isVerify: boolean;
  failedLoginAttempts: number;
}

export interface RegisterResponse {
  message: string;
  projectId: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  ownerId?: string;
  appKey: string;
  plan: string;
  subscriptionStatus: string;
  isLoading: boolean;

  // Actions
  setAuth: (data: {
    user: User;
    token: string;
    ownerId?: string;
    appKey: string;
    plan: string;
    subscriptionStatus: string;
  }) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  checkAuth: () => void;
  hydrate: () => void;
}
