"use client";

import { useEffect, useState } from "react";
import { getReviewsByGear } from "@/services/review";
import { Review } from "@/types/review.types";
import ReviewCard from "@/components/shared/ReviewCard";
import { Button } from "@/components/ui/button";

interface ReviewsSectionProps {
  gearId: string;
}

export default function ReviewsSection({ gearId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleReviews = showAll ? reviews : reviews.slice(0, 5);
  const hasMore = reviews.length > 5;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getReviewsByGear(gearId);
        setReviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [gearId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-muted animate-pulse rounded-md"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">{error}</p>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">No reviews yet</p>
    );
  }

  return (
    <div className="space-y-3">
      {visibleReviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}

      {hasMore && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="mt-2"
        >
          {showAll ? "See less" : "See more"}
        </Button>
      )}
    </div>
  );
}