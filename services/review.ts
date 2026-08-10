import { CreateReviewPayload, Review, ReviewsResponse } from "@/types/review.types";

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
