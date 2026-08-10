export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
}

export interface CategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Category[];
}

export interface SingleCategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Category;
}
