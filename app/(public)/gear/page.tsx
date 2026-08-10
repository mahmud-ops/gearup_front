"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter } from "lucide-react";
import GearCard from "@/components/shared/GearCard";
import FilterModal from "@/components/shared/FilterModal";
import { getCategories, getGears } from "@/services/gear";
import { GearItem } from "@/types/gear.types";

const toNumber = (value: string): number | null => {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

const GearPage = () => {
  const [allGears, setAllGears] = useState<GearItem[]>([]);
  const [categories, setCategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [gears, cats] = await Promise.all([
          getGears(""),
          getCategories(),
        ]);
        if (!cancelled) {
          setAllGears(gears);
          setCategories(cats);
        }
      } catch (error) {
        console.error("Failed to load gears:", error);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayed = useMemo(() => {
    const min = toNumber(minPrice);
    const max = toNumber(maxPrice);
    return allGears.filter((g) => {
      if (search && !g.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (selectedCategory && g.category.id !== selectedCategory) {
        return false;
      }
      const rate = Number(g.dailyRate);
      if (!Number.isFinite(rate)) return true;
      if (min != null && rate < min) return false;
      if (max != null && rate > max) return false;
      return true;
    });
  }, [allGears, search, selectedCategory, minPrice, maxPrice]);

  const handleReset = () => {
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="flex flex-col gap-4 m-2">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-1 border rounded px-3 py-2 hover:bg-muted transition-colors"
          aria-label="Open filters"
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filter</span>
        </button>

        <form className="flex items-center gap-2 max-w-sm w-full sm:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search gears..."
            className="border rounded px-3 py-2 flex-1 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
      </div>

      <div className="flex items-baseline justify-between">
        <p className="text-sm text-muted-foreground">
          {loaded
            ? `${displayed.length} result(s)`
            : "Loading..."}
        </p>
      </div>

      {loaded && displayed.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No gear matches your filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayed.map((g) => (
            <GearCard
              key={g.id}
              id={g.id}
              image={g.image}
              name={g.name}
              availableQuantity={g.availableQuantity}
              dailyRate={g.dailyRate}
              category={g.category.name}
            />
          ))}
        </div>
      )}

      <FilterModal
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onReset={handleReset}
      />
    </div>
  );
};

export default GearPage;
