"use client";

import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Review } from "@/types/review.types";

interface ReviewCardProps {
  review: Review;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function ReviewCard({ review }: ReviewCardProps) {
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
        <span className="text-xs text-muted-foreground">
          {formatDate(review.createdAt)}
        </span>
      </div>

      <p className="text-sm">{review.comment}</p>

      <p className="text-sm font-medium">{review.customer.name}</p>
    </Card>
  );
}