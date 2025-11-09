export interface JwtPayload {
  id: string;
  role: string;
  projectId: string;
  iat?: number;
  exp?: number;
  email?: string;
}
