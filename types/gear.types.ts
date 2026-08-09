export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface GearItem {
  id: string;
  name: string;
  description: string;
  dailyRate: string;
  availableQuantity: number;
  image: string;
  providerId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

export type AddGearPayload = {
  name: string;
  description: string;
  dailyRate: number;
  availableQuantity: number;
  image: string;
  categoryId: string;
};

export interface GearResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: GearItem[];
}
