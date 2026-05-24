import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, AuthenticationResponse } from '../types/auth';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data, 
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/reset-password") ||
      originalRequest.url?.includes("/auth/forgot-password") ||
      originalRequest.url?.includes("/auth/verify-otp")
    ) {
      return Promise.reject(error.response?.data || { message: error.message });
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (!storedRefreshToken) throw new Error('No refresh token available');

        const response = await axios.post<ApiResponse<AuthenticationResponse>>(
          `${apiClient.defaults.baseURL}/auth/refresh-token`,
          { refreshToken: storedRefreshToken }
        );

        const { access_token, refresh_token } = response.data.data;

        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error.response?.data || { message: error.message });
  }
);

export const paymentService = {
  createPayment: async (auctionId: string | number): Promise<any> => {
    return apiClient.post(`/payments/auction/${auctionId}/create`);
  }
};

export default apiClient;