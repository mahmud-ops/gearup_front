"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Image as ImageIcon, Plus } from "lucide-react";
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
import AddGearModal from "@/components/shared/AddGearModal";
import { GearItem } from "@/types/gear.types";

interface GearTableClientProps {
  gears: GearItem[];
}

export default function GearTableClient({ gears }: GearTableClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GearItem | null>(null);

  const handleEdit = (item: GearItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Gear Inventory
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your listed equipment
          </p>
        </div>
        <Button size="sm" onClick={() => handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Gear
        </Button>
      </div>

      {gears.length === 0 ? (
        <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          No gear items found. Click &quot;Add Gear&quot; to create one.
        </div>
      ) : (
        <>
          <div className="hidden rounded-md border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>Gear Name</TableHead>
                  <TableHead>Category</TableHead>
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
                    <TableCell>{item.dailyRate} tk/day</TableCell>
                    <TableCell>{item.availableQuantity}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(item)}
                          aria-label="Edit item"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Delete item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(item)}
                            aria-label="Edit item"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Delete item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.category.name}
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

      <AddGearModal
        key={editingItem ? `edit-${editingItem.id}` : "add"}
        isOpen={isModalOpen}
        onClose={handleClose}
        mode={editingItem ? "edit" : "add"}
        editData={editingItem}
        onSuccess={handleSuccess}
      />
    </>
  );
}
