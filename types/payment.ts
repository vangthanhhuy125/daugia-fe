export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface PaymentResponse {
  auctionId: string;
  payerEmail: string;
  amount: number;
  status: PaymentStatus;
  auctionTitle?: string;
  thumbnailUrl?: string;
  biddingEndTime?: string;
  currentPrice?: number;
  startingPrice?: number;
  paymentUrl?: string;
  vnpayTransactionNo?: string; 
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;
}