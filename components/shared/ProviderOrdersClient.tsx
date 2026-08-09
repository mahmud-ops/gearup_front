"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PackageOpen, PackageCheck } from "lucide-react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RentalOrder, OrderStatus } from "@/types/rental.types";
import {
  updateOrderStatus,
  formatDate,
  getOrderStatusVariant,
} from "@/services/rentals";

interface ProviderOrdersClientProps {
  initialOrders: RentalOrder[];
  error?: string | null;
}

const NEXT_STATUS: Record<OrderStatus, { label: string; status: OrderStatus; icon: React.ReactNode } | null> = {
  CONFIRMED: {
    label: "Mark Picked Up",
    status: "PICKEDUP",
    icon: <PackageOpen className="mr-2 h-4 w-4" />,
  },
  PICKEDUP: {
    label: "Mark Returned",
    status: "RETURNED",
    icon: <PackageCheck className="mr-2 h-4 w-4" />,
  },
  RETURNED: null,
};

const getOrderStatusClass = (status: OrderStatus) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "PICKEDUP":
      return "bg-green-100 text-green-800 border-green-200";
    case "RETURNED":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "";
  }
};

export default function ProviderOrdersClient({
  initialOrders,
  error,
}: ProviderOrdersClientProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<RentalOrder[]>(initialOrders);
  const [loadingOrderIds, setLoadingOrderIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    const token = Cookies.get("accessToken");
    if (!token) {
      showToast("Authentication required");
      return;
    }

    setLoadingOrderIds((prev) => new Set(prev).add(orderId));

    try {
      await updateOrderStatus(orderId, newStatus, token);

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
      showToast(`Order marked as ${newStatus.toLowerCase()}`);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update order status";
      showToast(message);
    } finally {
      setLoadingOrderIds((prev) => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  };

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="pt-8 flex flex-col items-center text-center">
          <p className="text-muted-foreground">
            No orders received yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-md border border-destructive bg-destructive px-4 py-3 text-sm text-white shadow-md">
          {toast}
        </div>
      )}

      <div className="hidden rounded-md border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rental Dates</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const next = NEXT_STATUS[order.status as OrderStatus];
              const isLoading = loadingOrderIds.has(order.id);

              return (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">
                    #{order.id}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.customer.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatDate(order.startDate)} - {formatDate(order.endDate)}
                  </TableCell>
                  <TableCell>
                    {order.rentalOrderItems.map((oi, idx) => (
                      <div
                        key={oi.item.name}
                        className={`text-xs ${
                          idx > 0 ? "mt-1" : ""
                        } text-muted-foreground`}
                      >
                        {oi.item.name} (x{oi.quantity})
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {Number(order.totalAmount).toFixed(2)} tk
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={getOrderStatusVariant(order.status as OrderStatus)}
                      className={getOrderStatusClass(order.status as OrderStatus)}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {next && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isLoading}
                        onClick={() =>
                          handleStatusUpdate(order.id, next.status)
                        }
                      >
                        {isLoading ? "Updating..." : next.label}
                        {!isLoading && next.icon}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-4 md:hidden">
        {orders.map((order) => {
          const next = NEXT_STATUS[order.status as OrderStatus];
          const isLoading = loadingOrderIds.has(order.id);

          return (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-mono">
                    #{order.id}
                  </CardTitle>
                  <Badge
                    variant={getOrderStatusVariant(order.status as OrderStatus)}
                    className={getOrderStatusClass(order.status as OrderStatus)}
                  >
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-1">
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.customer.email}
                  </p>
                </div>

                <div className="text-xs text-muted-foreground">
                  {formatDate(order.startDate)} - {formatDate(order.endDate)}
                </div>

                <div className="space-y-1">
                  {order.rentalOrderItems.map((oi) => (
                    <p
                      key={oi.item.name}
                      className="text-xs text-muted-foreground"
                    >
                      {oi.item.name} (x{oi.quantity})
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="font-semibold">
                    {Number(order.totalAmount).toFixed(2)} tk
                  </span>
                </div>

                {next && (
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={isLoading}
                    onClick={() => handleStatusUpdate(order.id, next.status)}
                  >
                    {isLoading ? "Updating..." : next.label}
                    {!isLoading && next.icon}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
