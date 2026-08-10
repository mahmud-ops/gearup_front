"use client";

import { useState } from "react";
import Image from "next/image";
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
import { RentalOrder, PaymentStatus } from "@/types/rental.types";
import {
  formatDate,
  getPaymentStatusVariant,
} from "@/services/rentals";
import ReviewModal from "@/components/shared/ReviewModal";
import { PayNowButton } from "@/components/shared/PayNowButton";

const isPaid = (status?: PaymentStatus) => status === "COMPLETED";

interface CustomerOrdersClientProps {
  orders: RentalOrder[];
}

export default function CustomerOrdersClient({ orders }: CustomerOrdersClientProps) {
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const reviewOrder = orders.find((o) => o.id === reviewOrderId) ?? null;

  return (
    <>
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-md border border-destructive bg-destructive px-4 py-3 text-sm text-white shadow-md">
          {toast}
        </div>
      )}

      {orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  Order #{order.id.slice(25)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="font-medium text-foreground">Provider:</span>{" "}
                    {order.provider.name}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Start Date:</span>{" "}
                    {formatDate(order.startDate)}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">End Date:</span>{" "}
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
                        <TableRow key={`${oi.item.id}-${idx}`}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="relative h-10 w-10 rounded overflow-hidden bg-muted">
                                {oi.item.image && (
                                  <Image
                                    src={oi.item.image}
                                    alt={oi.item.name}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              {oi.item.name}
                            </div>
                          </TableCell>
                          <TableCell>{oi.quantity}</TableCell>
                          <TableCell>{oi.item.dailyRate} tk</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-right sm:text-left">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">{order.totalAmount} tk</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge
                      variant={getPaymentStatusVariant(order.payment?.status)}
                    >
                      {order.payment?.status ?? "UNPAID"}
                    </Badge>

                    {order.status === "RETURNED" && (
                      <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                        RETURNED
                      </Badge>
                    )}

                    {!isPaid(order.payment?.status) && (
                      <PayNowButton orderId={order.id} />
                    )}

                    {order.status === "RETURNED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReviewOrderId(order.id)}
                      >
                        Leave Review
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {reviewOrder && (
            <ReviewModal
              isOpen={!!reviewOrderId}
              onClose={() => setReviewOrderId(null)}
              order={reviewOrder}
              onSuccess={() => showToast("Review submitted successfully!")}
            />
          )}
        </div>
      )}
    </>
  );
}
