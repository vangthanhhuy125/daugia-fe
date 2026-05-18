export interface CategoryRequest {
  name: string;
  description?: string; 
}

export interface CategoryResponse {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string; 
  updatedAt: string; 
}