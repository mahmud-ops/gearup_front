export interface RentalOrderItem {
  item: {
    id: string;
    name: string;
    image: string;
    dailyRate: string;
  };
  quantity: number;
}

export interface Provider {
  id: string;
  name: string;
  email: string;
}

export interface RentalOrder {
  id: string;
  customerId: string;
  providerId: string;
  startDate: string;
  endDate: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  provider: Provider;
  customer: Provider;
  rentalOrderItems: RentalOrderItem[];
  payment?: Payment;
}

export interface RentalOrdersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: RentalOrder[];
}

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface Payment {
  id: string;
  orderId: string;
  status: PaymentStatus;
  amount: string;
  createdAt: string;
}

export interface PaymentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Payment[];
}

export type OrderStatus =
  | "CONFIRMED"
  | "PICKEDUP"
  | "RETURNED";
