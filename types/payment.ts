export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface PaymentResponse {
  auctionId: string;
  payerEmail: string;
  amount: number;
  status: PaymentStatus;
  paymentUrl?: string;
  vnpayTransactionNo?: string; 
  paidAt?: string;
}