import { Category, GearItem, GearResponse } from "@/types/gear.types";

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(
    "https://gearup-backend-api.onrender.com/api/categories",
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data;
};

export const getGears = async (search?: string): Promise<GearItem[]> => {
  const response = await fetch(
    "https://gearup-backend-api.onrender.com/api/gear_items",
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const result: GearResponse = await response.json();

  const searchedGear = result.data.filter((g) =>
    g.name.toLowerCase().includes(search || ""),
  );

  return searchedGear;
};

export const getGear = async (id: string): Promise<GearItem> => {
  const response = await fetch(
    `https://gearup-backend-api.onrender.com/api/gear_items/${id}`,
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data;
};
