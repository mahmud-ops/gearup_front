"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RentalOrder } from "@/types/rental.types";
import { createReview } from "@/services/review";
import Cookies from "js-cookie";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: RentalOrder;
  onSuccess?: () => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  order,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const gearItemId = order.rentalOrderItems[0]?.item.id;

  console.log("=== ReviewModal Debug ===");
  console.log("order:", order);
  console.log("order.rentalOrderItems:", order.rentalOrderItems);
  console.log("first rentalOrderItem:", order.rentalOrderItems[0]);
  console.log("first rentalOrderItem keys:", order.rentalOrderItems[0] ? Object.keys(order.rentalOrderItems[0]) : "N/A");
  console.log("first rentalOrderItem.item:", order.rentalOrderItems[0]?.item);
  console.log("first rentalOrderItem.item keys:", order.rentalOrderItems[0]?.item ? Object.keys(order.rentalOrderItems[0].item) : "N/A");
  console.log("gearItemId:", gearItemId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    console.log("handleSubmit called", { orderId: order.id, gearItemId, rating, comment });

    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Authentication required");

      if (!gearItemId) throw new Error("Invalid order items");

      await createReview(order.id, {
        gearItemId,
        rating,
        comment,
      }, token);

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Review submit error:", err);
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md relative">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-sm font-semibold">Leave a Review</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && <div className="text-xs text-destructive">{error}</div>}

          <div className="grid gap-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0 bg-transparent border-none cursor-pointer"
                  aria-label={`${star} star`}
                >
                  <Star
                    className="h-6 w-6"
                    fill={
                      star <= (hoverRating || rating)
                        ? "currentColor"
                        : "none"
                    }
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || rating === 0}>
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
