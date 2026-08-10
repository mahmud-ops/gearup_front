import {
  CreateReviewPayload,
  Review,
  ReviewsResponse,
  UpdateReviewPayload,
} from "@/types/review.types";

export const createReview = async (
  orderId: string,
  payload: CreateReviewPayload,
  token: string,
): Promise<Review> => {
  const response = await fetch(
    `https://gearup-backend-api.onrender.com/api/review/${orderId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create review");
  }

  return data.data;
};

export const getReviewsByGear = async (gearId: string): Promise<Review[]> => {
  const response = await fetch(
    `https://gearup-backend-api.onrender.com/api/review/gear/${gearId}`,
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const result: ReviewsResponse = await response.json();
  return result.data;
};

export const updateReview = async (
  reviewId: string,
  payload: UpdateReviewPayload,
  token: string,
): Promise<Review> => {
  const response = await fetch(
    `https://gearup-backend-api.onrender.com/api/review/${reviewId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update review");
  }

  return data.data;
};

export const deleteReview = async (
  reviewId: string,
  token: string,
): Promise<void> => {
  const response = await fetch(
    `https://gearup-backend-api.onrender.com/api/review/${reviewId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete review");
  }
};
