"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Check, Edit, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/types/category.types";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/category";
import { CenteredSpinner } from "@/components/shared/CenteredSpinner";

export default function CategoryManagement() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const getToken = (): string | null => {
    const token = Cookies.get("accessToken");
    if (!token) {
      showToast("Authentication required");
      router.push("/login");
      return null;
    }
    return token;
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load categories";
      showToast(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;

    setSubmitting(true);
    const token = getToken();
    if (!token) {
      setSubmitting(false);
      return;
    }

    try {
      await createCategory(
        { name: trimmed, description: newDescription.trim() },
        token,
      );
      setNewName("");
      setNewDescription("");
      showToast("Category added successfully.");
      await fetchCategories();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add category";
      showToast(message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingSlug(category.slug);
    setEditName(category.name);
    setEditDescription(category.description);
  };

  const cancelEdit = () => {
    setEditingSlug(null);
    setEditName("");
    setEditDescription("");
  };

  const handleSaveEdit = async () => {
    if (!editingSlug) return;

    const token = getToken();
    if (!token) return;

    setSubmitting(true);
    try {
      await updateCategory(
        editingSlug,
        { name: editName.trim(), description: editDescription.trim() },
        token,
      );
      setEditingSlug(null);
      setEditName("");
      setEditDescription("");
      showToast("Category updated successfully.");
      await fetchCategories();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update category";
      showToast(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`,
    );
    if (!confirmed) return;

    const token = getToken();
    if (!token) return;

    setDeletingSlug(category.slug);
    try {
      await deleteCategory(category.slug, token);
      showToast("Category deleted successfully.");
      await fetchCategories();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete category";
      showToast(message);
    } finally {
      setDeletingSlug(null);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  return (
    <>
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-md border border-destructive bg-destructive px-4 py-3 text-sm text-white shadow-md">
          {toast}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            {categories.length} total categor
            {categories.length !== 1 ? "ies" : "y"}
          </p>
        </div>

        <Card>
          <CardContent className="pt-4">
            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter category name..."
                disabled={submitting}
                required
                className="sm:flex-1"
              />
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description (optional)"
                disabled={submitting}
                className="sm:flex-1"
                rows={2}
              />
              <Button
                type="submit"
                disabled={submitting || !newName.trim()}
                className="sm:shrink-0"
              >
                <Plus className="h-4 w-4 mr-1" />
                {submitting ? "Adding..." : "Add"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {loading ? (
          <CenteredSpinner />
        ) : categories.length === 0 ? (
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <p className="text-muted-foreground">No categories found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.slug}>
                    <TableCell>
                      {editingSlug === category.slug ? (
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          disabled={submitting}
                        />
                      ) : (
                        <span className="font-medium">{category.name}</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {category.slug}
                    </TableCell>
                     <TableCell className="text-muted-foreground">
                       {editingSlug === category.slug ? (
                         <Textarea
                           value={editDescription}
                           onChange={(e) => setEditDescription(e.target.value)}
                           disabled={submitting}
                           rows={2}
                           className="text-xs"
                         />
                       ) : (
                         category.description
                       )}
                     </TableCell>
                    <TableCell className="text-right">
                      {editingSlug === category.slug ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSaveEdit}
                            disabled={submitting}
                            className="gap-1 mr-1"
                          >
                            <Check className="h-4 w-4" />
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelEdit}
                            disabled={submitting}
                            className="gap-1"
                          >
                            <X className="h-4 w-4" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(category)}
                            className="gap-1 mr-1"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(category)}
                            disabled={deletingSlug === category.slug}
                            className="gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            {deletingSlug === category.slug
                              ? "Deleting..."
                              : "Delete"}
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
