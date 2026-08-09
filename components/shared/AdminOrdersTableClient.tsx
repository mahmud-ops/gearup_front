"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RentalOrder } from "@/types/rental.types";
import { getAllRentalOrders, formatDate, getPaymentStatusVariant, getOrderStatusVariant } from "@/services/rentals";

export default function AdminOrdersTableClient() {
  const router = useRouter();
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const fetchOrders = async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      showToast("Authentication required");
      router.push("/login");
      return;
    }

    try {
      const result = await getAllRentalOrders(token);
      setOrders(result.data ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load orders";
      showToast(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Loading orders...</p>
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

      <div className="container mx-auto p-4 md:p-8 max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Rental Orders</h1>
          <p className="text-sm text-muted-foreground">
            {orders.length} total order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="pt-8 flex flex-col items-center text-center">
              <p className="text-muted-foreground">No rental orders found.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="hidden rounded-md border md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-28">Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Gear / Items</TableHead>
                    <TableHead>Rental Dates</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-center">Payment</TableHead>
                    <TableHead className="text-center">Order Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
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
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{order.provider.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.provider.email}
                          </p>
                        </div>
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
                      <TableCell className="text-xs">
                        {formatDate(order.startDate)} - {formatDate(order.endDate)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {Number(order.totalAmount).toFixed(2)} tk
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={getPaymentStatusVariant(order.payment?.status)}
                        >
                          {order.payment?.status ?? "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={getOrderStatusVariant(order.status as any)}
                          className={(() => {
                            const status = order.status as any;
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
                          })()}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="grid gap-4 md:hidden">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-mono text-sm font-medium">
                        #{order.id}
                      </h3>
                      <Badge
                        variant={getOrderStatusVariant(order.status as any)}
                        className={(() => {
                          const status = order.status as any;
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
                        })()}
                      >
                        {order.status}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Customer:</span> {order.customer.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Provider:</span> {order.provider.name}
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

                    <div className="flex items-center justify-between pt-2 text-sm">
                      <span className="font-semibold">
                        {Number(order.totalAmount).toFixed(2)} tk
                      </span>
                      <Badge variant={getPaymentStatusVariant(order.payment?.status)}>
                        {order.payment?.status ?? "N/A"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
