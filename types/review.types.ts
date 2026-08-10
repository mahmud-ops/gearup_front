export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface GearItemRef {
  id: string;
  name: string;
  image: string;
}

export interface OrderRef {
  id: string;
  startDate: string;
  endDate: string;
}

export interface Review {
  id: string;
  customerId: string;
  gearItemId: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  gearItem: GearItemRef;
  order: OrderRef;
}

export interface CreateReviewPayload {
  gearItemId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export interface ReviewsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Review[];
}
