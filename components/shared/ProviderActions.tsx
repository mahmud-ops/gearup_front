"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, X, Package, ClipboardList } from "lucide-react";

export const ProviderActions = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      <div
        className="flex flex-col items-center gap-3"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0)" : "translateY(10px)",
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 200ms ease-in-out, transform 200ms ease-in-out",
        }}
      >
        <Link
          href="/dashboard/provider/gear"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
          aria-label="Inventory"
          onClick={() => setIsOpen(false)}
        >
          <Package className="h-5 w-5" />
          <span className="text-sm font-medium whitespace-nowrap">Inventory</span>
        </Link>
        <Link
          href="/dashboard/provider/orders"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
          aria-label="Orders"
          onClick={() => setIsOpen(false)}
        >
          <ClipboardList className="h-5 w-5" />
          <span className="text-sm font-medium whitespace-nowrap">Orders</span>
        </Link>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center justify-center"
        aria-label={isOpen ? "Close actions" : "Open actions"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform duration-200 rotate-45" />
        ) : (
          <Plus className="h-6 w-6 transition-transform duration-200" />
        )}
      </button>
    </div>
  );
};
