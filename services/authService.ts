import apiClient from '../api/apiClient';
import { 
  ApiResponse, 
  AuthenticationRequest, 
  AuthenticationResponse, 
  ChangePasswordRequest, 
  ForgotPasswordRequest, 
  LogoutRequest, 
  RefreshTokenRequest, 
  RegisterRequest, 
  ResetPasswordRequest, 
  VerifyOtpRequest 
} from '../types/auth';

export const authService = {
  register: (data: RegisterRequest): Promise<ApiResponse<string>> => {
    return apiClient.post('/auth/register', data);
  },

  verifyOtp: (data: VerifyOtpRequest): Promise<ApiResponse<AuthenticationResponse>> => {
    return apiClient.post('/auth/verify-otp', data);
  },

  authenticate: (data: AuthenticationRequest): Promise<ApiResponse<AuthenticationResponse>> => {
    return apiClient.post('/auth/authenticate', data);
  },

  refreshToken: (data: RefreshTokenRequest): Promise<ApiResponse<AuthenticationResponse>> => {
    return apiClient.post('/auth/refresh-token', data);
  },

  forgotPassword: (data: ForgotPasswordRequest): Promise<ApiResponse<string>> => {
    return apiClient.post('/auth/forgot-password', data);
  },

  resetPassword: (data: ResetPasswordRequest): Promise<ApiResponse<string>> => {
    return apiClient.post('/auth/reset-password', data);
  },

  changePassword: (data: ChangePasswordRequest): Promise<ApiResponse<string>> => {
    return apiClient.post('/auth/change-password', data);
  },

  logout: (data: LogoutRequest): Promise<ApiResponse<string>> => {
    return apiClient.post('/auth/logout', data);
  }
};