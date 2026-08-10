import {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/category.types";

const BASE_URL = "https://gearup-backend-api.onrender.com/api/categories";

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data;
};

export const getCategory = async (slug: string): Promise<Category> => {
  const response = await fetch(`${BASE_URL}/${slug}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data;
};

export const createCategory = async (
  payload: CreateCategoryPayload,
  token: string,
): Promise<Category> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create category");
  }

  return data.data;
};

export const updateCategory = async (
  slug: string,
  payload: UpdateCategoryPayload,
  token: string,
): Promise<Category> => {
  const response = await fetch(`${BASE_URL}/${slug}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update category");
  }

  return data.data;
};

export const deleteCategory = async (
  slug: string,
  token: string,
): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${slug}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete category");
  }
};
