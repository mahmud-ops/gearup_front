"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Category, AddGearPayload, GearItem } from "@/types/gear.types";
import { getCategories, addGear, updateGear } from "@/services/gear";
import Cookies from "js-cookie";
import { uploadImage } from "@/services/cloudinary";

type ModalMode = "add" | "edit";

interface AddGearModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: ModalMode;
  editData?: GearItem | null;
  onSuccess?: () => void;
}

export default function AddGearModal({
  isOpen,
  onClose,
  mode = "add",
  editData = null,
  onSuccess,
}: AddGearModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const categoriesFetchedRef = useRef(false);
  const [image, setImage] = useState<File | null>(null);
  const imagePreviewState = useState(() => editData?.image ?? "");
  const imagePreview = imagePreviewState[0];

  const isEdit = mode === "edit";

  const [formData, setFormData] = useState(() => ({
    name: editData?.name ?? "",
    description: editData?.description ?? "",
    dailyRate: editData ? Number(editData.dailyRate) : 0,
    availableQuantity: editData ? editData.availableQuantity : 1,
    categoryId: editData?.categoryId ?? "",
  }));

  useEffect(() => {
    if (!isOpen || categoriesFetchedRef.current) return;
    categoriesFetchedRef.current = true;

    let cancelled = false;

    (async () => {
      try {
        const cats = await getCategories();
        if (!cancelled) {
          setCategories(cats);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load categories");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("No token found");

      let imageUrl = imagePreview;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        dailyRate: Number(formData.dailyRate),
        availableQuantity: Number(formData.availableQuantity),
        ...(imageUrl ? { image: imageUrl } : {}),
        categoryId: formData.categoryId,
      };

      if (isEdit && editData) {
        await updateGear(editData.id, payload, token);
      } else {
        await addGear(payload as AddGearPayload, token);
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const adjustQuantity = (delta: number) => {
    setFormData((prev) => {
      const current = Number(prev.availableQuantity) || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, availableQuantity: next };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg relative">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-sm font-semibold">
            {isEdit ? "Edit Gear" : "Add New Gear"}
          </h2>
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
          {success && (
            <div className="text-xs text-green-600">
              {isEdit ? "Gear updated successfully!" : "Gear added successfully!"}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dailyRate">Daily Rate (tk/day)</Label>
              <Input
                id="dailyRate"
                type="number"
                min="0"
                step="0.01"
                value={String(formData.dailyRate)}
                onChange={(e) =>
                  updateField("dailyRate", Number(e.target.value))
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="availableQuantity">Available Quantity</Label>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-xs"
                  onClick={() => adjustQuantity(-1)}
                  aria-label="Decrease quantity"
                >
                  -
                </Button>
                <Input
                  id="availableQuantity"
                  type="number"
                  min="1"
                  value={String(formData.availableQuantity)}
                  onChange={(e) =>
                    updateField("availableQuantity", Number(e.target.value))
                  }
                  required
                  className="text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon-xs"
                  onClick={() => adjustQuantity(1)}
                  aria-label="Increase quantity"
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">
              Gear Image {isEdit && "(leave empty to keep current)"}
            </Label>
            {imagePreview && !image && (
              <div className="flex items-center gap-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-12 w-12 rounded object-cover border"
                />
                <span className="text-xs text-muted-foreground">
                  Current image
                </span>
              </div>
            )}
            {image && (
              <div className="flex items-center gap-2">
                <img
                  src={URL.createObjectURL(image)}
                  alt="New preview"
                  className="h-12 w-12 rounded object-cover border"
                />
                <span className="text-xs text-muted-foreground">
                  New image selected
                </span>
              </div>
            )}
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setImage(file);
              }}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => updateField("categoryId", value ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting || success}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || success}>
              {submitting
                ? isEdit
                  ? "Updating..."
                  : "Adding..."
                : success
                  ? isEdit
                    ? "Updated!"
                    : "Added!"
                  : isEdit
                    ? "Update Gear"
                    : "Add Gear"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}