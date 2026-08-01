import { GearItem, GearResponse } from "@/types/gear.types";

export const getGears = async (): Promise<GearItem[]> => {
  const response = await fetch(
    "https://gearup-backend-api.onrender.com/api/gear_items",
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const result: GearResponse = await response.json();

  return result.data;
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