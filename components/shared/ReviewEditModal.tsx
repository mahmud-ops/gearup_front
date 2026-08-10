"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Review } from "@/types/review.types";
import { updateReview } from "@/services/review";
import Cookies from "js-cookie";

interface ReviewEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review;
  onSuccess?: (updatedReview: Review) => void;
}

export default function ReviewEditModal({
  isOpen,
  onClose,
  review,
  onSuccess,
}: ReviewEditModalProps) {
  const [rating, setRating] = useState(review.rating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(review.comment);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Authentication required");

      const payload = {
        ...(rating !== review.rating && { rating }),
        ...(comment !== review.comment && { comment }),
      };

      if (Object.keys(payload).length === 0) {
        onClose();
        return;
      }

      const updated = await updateReview(review.id, payload, token);
      onSuccess?.(updated);
      onClose();
    } catch (err) {
      console.error("Review update error:", err);
      setError(err instanceof Error ? err.message : "Failed to update review");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md relative">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-sm font-semibold">Edit Review</h2>
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
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}