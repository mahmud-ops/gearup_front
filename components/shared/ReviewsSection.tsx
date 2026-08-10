"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getReviewsByGear, deleteReview } from "@/services/review";
import { Review } from "@/types/review.types";
import ReviewCard from "@/components/shared/ReviewCard";
import { Button } from "@/components/ui/button";
import ReviewEditModal from "@/components/shared/ReviewEditModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

interface ReviewsSectionProps {
  gearId: string;
  currentUserId?: string;
}

export default function ReviewsSection({
  gearId,
  currentUserId,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  const visibleReviews = showAll ? reviews : reviews.slice(0, 5);
  const hasMore = reviews.length > 5;

  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async () => {
      if (!isMounted) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getReviewsByGear(gearId);
        setReviews(data);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load reviews");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [gearId]);

  const handleEdit = (review: Review) => {
    setEditingReview(review);
  };

  const handleEditSuccess = (updated: Review) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r)),
    );
    window.location.reload();
  };

  const handleDeleteClick = (reviewId: string) => {
    setDeletingReviewId(reviewId);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingReviewId) return;

    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Authentication required");

      await deleteReview(deletingReviewId, token);
      setReviews((prev) => prev.filter((r) => r.id !== deletingReviewId));
      setDeletingReviewId(null);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review");
      setDeletingReviewId(null);
    }
  };

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
        <ReviewCard
          key={review.id}
          review={review}
          currentUserId={currentUserId}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
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

      {editingReview && (
        <ReviewEditModal
          isOpen
          onClose={() => setEditingReview(null)}
          review={editingReview}
          onSuccess={handleEditSuccess}
        />
      )}

      <ConfirmDialog
        open={!!deletingReviewId}
        title="Delete review?"
        description="This action cannot be undone. Are you sure you want to delete this review?"
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingReviewId(null)}
      />
    </div>
  );
}