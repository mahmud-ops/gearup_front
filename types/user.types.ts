export interface UsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CurrentUser[];
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string; // e.g., "CUSTOMER", "PROVIDER", "ADMIN"
  status: string;
  createdAt: string;
  updatedAt: string;
  gearItems: any[]; // You can replace 'any' with a specific type if needed
  customerOrders: any[];
  providerOrders: any[];
}