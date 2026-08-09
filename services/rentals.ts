import {
  RentalOrdersResponse,
  PaymentResponse,
  PaymentStatus,
  OrderStatus,
} from "@/types/rental.types";

export const createRental = async (payload: unknown, token: string) => {
  const response = await fetch(
    "https://gearup-backend-api.onrender.com/api/rental_orders",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create rental");
  }

  return result;
};

export const getRentalOrders = async (
  token: string
): Promise<RentalOrdersResponse> => {
  const response = await fetch(
    "https://gearup-backend-api.onrender.com/api/rental_orders/me",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error(`HTTP ${response.status}`);
  }

  const result: RentalOrdersResponse = await response.json();
  return result;
};

export const getProviderOrders = async (
  token: string
): Promise<RentalOrdersResponse> => {
  const response = await fetch(
    "https://gearup-backend-api.onrender.com/api/rental_orders/provider/me",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error(`HTTP ${response.status}`);
  }

  const result: RentalOrdersResponse = await response.json();
  return result;
};

export const getAllRentalOrders = async (
  token: string,
): Promise<RentalOrdersResponse> => {
  const response = await fetch(
    "https://gearup-backend-api.onrender.com/api/rental_orders",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error(`HTTP ${response.status}`);
  }

  const result: RentalOrdersResponse = await response.json();
  return result;
};

export const updateOrderStatus = async (
  orderId: string,
  status: string,
  token: string,
) => {
  const response = await fetch(
    `https://gearup-backend-api.onrender.com/api/rental_orders/${orderId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
};

export const getPaymentStatuses = async (
  token: string
): Promise<PaymentResponse> => {
  const response = await fetch(
    "https://gearup-backend-api.onrender.com/api/payment/my-payments",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error(`HTTP ${response.status}`);
  }

  const result: PaymentResponse = await response.json();
  return result;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getPaymentStatusVariant = (
  status?: PaymentStatus,
): "default" | "secondary" | "destructive" | "outline" => {
  if (!status) return "secondary";
  const normalized = status.toLowerCase();
  if (normalized === "completed") return "default";
  if (normalized === "failed" || normalized === "cancelled") {
    return "destructive";
  }
  return "secondary";
};

export const getOrderStatusVariant = (
  status?: OrderStatus,
): "default" | "secondary" | "destructive" | "outline" => {
  if (!status) return "secondary";
  const normalized = status.toLowerCase();
  if (normalized === "confirmed" || normalized === "pickedup") {
    return "default";
  }
  if (normalized === "returned") {
    return "destructive";
  }
  return "secondary";
};