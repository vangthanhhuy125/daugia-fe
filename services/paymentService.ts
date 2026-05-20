import apiClient from "../api/apiClient";
import { ApiResponse } from "../types/auth"; 
import { PaymentResponse } from "../types/payment";

export const paymentService = {
  createPayment: (auctionId: string): Promise<ApiResponse<PaymentResponse>> => {
    return apiClient.post(`/payments/auction/${auctionId}/create`);
  },

  getByAuction: (auctionId: string): Promise<ApiResponse<PaymentResponse>> => {
    return apiClient.get(`/payments/auction/${auctionId}`);
  },

  getMyPayments: (): Promise<ApiResponse<PaymentResponse[]>> => {
    return apiClient.get("/payments/my");
  },

  /**
   * Xử lý callback trả về từ VNPay sau khi người dùng thanh toán xong (hoặc hủy)
   * GET: /api/v1/payments/vnpay-return
   * @param params 
   */
  
  vnpayReturn: (params: Record<string, string>): Promise<ApiResponse<PaymentResponse>> => {
    return apiClient.get("/payments/vnpay-return", {
      params: params
    });
  }
};