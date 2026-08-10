import { cookies } from "next/headers";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RentalOrder } from "@/types/rental.types";
import { getRentalOrders, getPaymentStatuses } from "@/services/rentals";
import CustomerOrdersClient from "@/components/shared/CustomerOrdersClient";

const CustomerPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  let orders: RentalOrder[] = [];
  let error: string | null = null;

  if (token) {
    try {
      const ordersResult = await getRentalOrders(token);
      orders = ordersResult.data ?? [];

      try {
        const paymentsResult = await getPaymentStatuses(token);
        const paymentMap = new Map(
          paymentsResult.data.map((p) => [p.orderId, p]),
        );
        orders = orders.map((order) => ({
          ...order,
          payment: paymentMap.get(order.id),
        }));
      } catch {
        // orders still render without payment info
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load orders";
      if (message === "Unauthorized") {
        window.location.href = "/login";
      } else {
        error = message;
      }
    }
  } else {
    error = "You must be logged in to view your orders.";
  }

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0,
  );

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-sm text-muted-foreground">
            {orders.length} order{orders.length !== 1 ? "s" : ""} placed
          </p>
        </div>
        <Link href="/gear">
          <Button variant="outline" className="rounded-lg">
            Browse Gear
          </Button>
        </Link>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {orders.length > 0 && !error && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Total spent across all orders:{" "}
              <span className="font-semibold text-foreground">
                {totalSpent.toFixed(2)} tk
              </span>
            </p>
          </CardContent>
        </Card>
      )}

      {orders.length === 0 && !error && (
        <Card>
          <CardContent className="pt-8 flex flex-col items-center text-center">
            <p className="text-muted-foreground">
              You haven&apos;t placed any orders yet.
            </p>
          </CardContent>
        </Card>
      )}

      <CustomerOrdersClient orders={orders} />
    </div>
  );
};

export default CustomerPage;
