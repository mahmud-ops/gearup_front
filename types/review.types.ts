export interface Review {
  id: string;
  customerId: string;
  gearItemId: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewPayload {
  gearItemId: string;
  rating: number;
  comment: string;
}
