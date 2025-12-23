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

