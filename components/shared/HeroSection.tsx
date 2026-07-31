import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto">
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
        Gear Up
      </h1>

      <p className="text-base sm:text-lg leading-relaxed max-w-xl mb-8">
        Discover premium sports and outdoor equipment from trusted providers.
        Rent only when you need it.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Link href="/gear">
          <Button className="px-6 py-2.5 rounded-lg font-medium">
            Browse Gear
          </Button>
        </Link>

        <Button
          variant="outline"
          className="px-6 py-2.5 rounded-lg font-medium border"
        >
          Become a Provider
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
