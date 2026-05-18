export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type RoleType = 'BIDDER' | 'SELLER' | 'ADMIN'; 
export type OtpPurpose = 'REGISTRATION' | 'FORGOT_PASSWORD';

export interface AuthenticationResponse {
  access_token: string;  
  refresh_token: string;
  role: string;
}

export interface RegisterRequest {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: RoleType;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  purpose: OtpPurpose;
}

export interface AuthenticationRequest {
  identifier: string; 
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface LogoutRequest {
  token: string;
}