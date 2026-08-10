import type { Category } from "@/types/category.types";

export type { Category } from "@/types/category.types";

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

export type UpdateGearPayload = Partial<AddGearPayload>;

export interface GearResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: GearItem[];
}
