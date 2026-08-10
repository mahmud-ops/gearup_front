"use client";

import { Pencil, Star, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Review } from "@/types/review.types";

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function ReviewCard({
  review,
  currentUserId,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  const isOwner = currentUserId && review.customerId === currentUserId;

  return (
    <Card className="p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              className={
                star <= review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {formatDate(review.createdAt)}
          </span>
          {isOwner && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onEdit?.(review)}
                aria-label="Edit review"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onDelete?.(review.id)}
                aria-label="Delete review"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm">{review.comment}</p>

      <p className="text-sm font-medium">{review.customer.name}</p>
    </Card>
  );
}