"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Image as ImageIcon } from "lucide-react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GearItem } from "@/types/gear.types";
import { getGears, deleteGear } from "@/services/gear";
import { CenteredSpinner } from "@/components/shared/CenteredSpinner";

export default function AdminGearTableClient() {
  const router = useRouter();
  const [gears, setGears] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const fetchGears = async () => {
    try {
      const data = await getGears();
      setGears(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load gear";
      showToast(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: GearItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`,
    );
    if (!confirmed) return;

    const token = Cookies.get("accessToken");
    if (!token) {
      showToast("Authentication required");
      router.push("/login");
      return;
    }

    setDeletingId(item.id);
    try {
      await deleteGear(item.id, token);
      setGears((prev) => prev.filter((g) => g.id !== item.id));
      showToast("Gear item deleted successfully.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete gear";
      showToast(message);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchGears();
  }, []);

  return (
    <>
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-md border border-destructive bg-destructive px-4 py-3 text-sm text-white shadow-md">
          {toast}
        </div>
      )}

      <div className="container mx-auto p-4 md:p-8 max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gear</h1>
          <p className="text-sm text-muted-foreground">
            {gears.length} total item{gears.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <CenteredSpinner />
        ) : gears.length === 0 ? (
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <p className="text-muted-foreground">No gear items found.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="hidden rounded-md border md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Daily Rate</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gears.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex h-12 w-12 items-center justify-center rounded border bg-muted">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full rounded object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category.name}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {item.providerId}
                      </TableCell>
                      <TableCell>{item.dailyRate} tk/day</TableCell>
                      <TableCell>{item.availableQuantity}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item)}
                          disabled={deletingId === item.id}
                          className="gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          {deletingId === item.id ? "Deleting..." : "Delete"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="grid gap-4 md:hidden">
              {gears.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded border bg-muted">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full rounded object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium leading-none">{item.name}</h3>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item.id}
                            className="h-8 px-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {item.category.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          Provider: {item.providerId}
                        </p>
                        <div className="pt-2 text-sm">
                          <span className="font-semibold">
                            {item.dailyRate} tk/day
                          </span>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <span className="text-muted-foreground">
                            {item.availableQuantity} available
                          </span>
                        </div>
                      </div>
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
