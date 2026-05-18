export interface Role {
  id: string;
  name: string; // 'ADMIN' | 'SELLER' | 'BIDDER'
}

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  street: string;
  ward: string;
  province: string;
  role: Role;
  enabled: boolean;
  locked?: boolean; 
  createdAt: string; 
  updatedAt: string;
}

export type UserAccountAction = "LOCK" | "UNLOCK";

export interface UserAccountActionRequest {
  reason: string;
}

export interface UserAccountLogDto {
  id: string;
  targetUserId: string;
  targetUserEmail: string;
  performedBy: string;
  action: UserAccountAction;
  reason: string;
  createdAt: string; 
}