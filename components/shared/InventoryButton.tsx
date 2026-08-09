"use client";

import Link from "next/link";
import { Package } from "lucide-react";

export const InventoryButton = () => {
  return (
    <Link
      href="/dashboard/provider/gear"
      className="fixed bottom-6 right-6 w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-50 flex flex-col items-center justify-center gap-0.5 shrink-0"
      aria-label="Inventory Management"
    >
      <Package className="h-5 w-5" />
      <span className="text-[9px] font-medium leading-none">Inventory</span>
    </Link>
  );
};