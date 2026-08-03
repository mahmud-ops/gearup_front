export interface RentalOrderItem {
  item: {
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
  rentalOrderItems: RentalOrderItem[];
}

export interface RentalOrdersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: RentalOrder[];
}
