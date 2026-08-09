import { Category, GearItem, GearResponse, AddGearPayload, UpdateGearPayload } from "@/types/gear.types";

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

export const addGear = async (payload: AddGearPayload, token: string) => {
  const response = await fetch(
    "https://gearup-backend-api.onrender.com/api/gear_items",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add gear");
  }

  return data;
};

export const updateGear = async (
  id: string,
  payload: UpdateGearPayload,
  token: string,
) => {
  const response = await fetch(
    `https://gearup-backend-api.onrender.com/api/gear_items/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update gear");
  }

  return data;
};

export const deleteGear = async (id: string, token: string) => {
  const response = await fetch(
    `https://gearup-backend-api.onrender.com/api/gear_items/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete gear");
  }

  return data;
};