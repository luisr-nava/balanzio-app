import { User } from "../../interfaces";

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

