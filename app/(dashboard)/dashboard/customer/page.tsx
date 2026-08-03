import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RentalOrder, PaymentStatus } from "@/types/rental.types";
import { getRentalOrders, getPaymentStatuses } from "@/services/rentals";
import { PayNowButton } from "@/components/shared/PayNowButton";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getPaymentStatusVariant = (
  status?: PaymentStatus
): "default" | "secondary" | "destructive" | "outline" => {
  if (!status) return "secondary";
  const normalized = status.toLowerCase();
  if (normalized === "completed") return "default";
  if (normalized === "failed" || normalized === "cancelled") {
    return "destructive";
  }
  return "secondary";
};

const isPaid = (status?: PaymentStatus) => status === "COMPLETED";

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
          paymentsResult.data.map((p) => [p.orderId, p])
        );
        orders = orders.map((order) => ({
          ...order,
          payment: paymentMap.get(order.id),
        }));
      } catch {
        // payments unavailable; orders still render without payment info
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load orders";
      if (message === "Unauthorized") {
        error = "Your session has expired. Please log in again.";
      } else {
        error = message;
      }
    }
  } else {
    error = "You must be logged in to view your orders.";
  }

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
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
        <Link href="/">
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

      {orders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Total spent across all orders:{" "}
              <span className="font-semibold text-foreground">
                ${totalSpent.toFixed(2)}
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

      {orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order: RentalOrder) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  Order #{order.id.slice(0, 8)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="font-medium text-foreground">Provider:</span>{" "}
                    {order.provider.name}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">
                      Start Date:
                    </span>{" "}
                    {formatDate(order.startDate)}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">
                      End Date:
                    </span>{" "}
                    {formatDate(order.endDate)}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Daily Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.rentalOrderItems.map((oi, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="relative h-10 w-10 rounded overflow-hidden bg-muted">
                                {oi.item.image && (
                                  <Image
                                    src={oi.item.image}
                                    alt={oi.item.name}
                                    fill
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              {oi.item.name}
                            </div>
                          </TableCell>
                          <TableCell>{oi.quantity}</TableCell>
                          <TableCell>${oi.item.dailyRate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-right sm:text-left">
                    <p className="text-sm text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold">${order.totalAmount}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getPaymentStatusVariant(order.payment?.status)}>
                      {order.payment?.status ?? "NO PAYMENT"}
                    </Badge>
                    {!isPaid(order.payment?.status) && (
                      <PayNowButton orderId={order.id} />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerPage;
