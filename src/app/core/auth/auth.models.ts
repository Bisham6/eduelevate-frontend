export interface AdminUser {
  id: string;
  email: string;
  role: string;
  fullName?: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  user: AdminUser;
}
