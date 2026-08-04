"use client";

import { useEffect, useState } from "react";
import GearCard, { type GearCardProps } from "@/components/shared/GearCard";
import { getCategories, getGears } from "@/services/gear";

const GearPage = () => {
  const [gears, setGears] = useState<GearCardProps[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  const handleSearch = async (query: string) => {
    const results = await getGears(query);
    const filtered = selectedCategory
      ? results.filter((g) => g.category.id === selectedCategory)
      : results;
    setGears(
      filtered.map((g) => ({
        id: g.id,
        image: g.image,
        name: g.name,
        availableQuantity: g.availableQuantity,
        dailyRate: g.dailyRate,
        category: g.category.name,
      })),
    );
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    handleSearch(search);
  };

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    handleSearch("");
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(search);
  };

  return (
    <div className="flex flex-col gap-4 m-2">
      <form onSubmit={onSubmit} className="flex gap-2">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border rounded px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search gears..."
          className="border rounded px-3 py-2 flex-1 w-full outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          Search
        </button>
      </form>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {gears.map((g) => (
          <GearCard
            key={g.id}
            id={g.id}
            image={g.image}
            name={g.name}
            availableQuantity={g.availableQuantity}
            dailyRate={g.dailyRate}
            category={g.category}
          />
        ))}
      </div>
    </div>
  );
};

export default GearPage;