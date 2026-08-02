"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GearItem } from "@/types/gear.types";
import { calculateDays, calculatePrice } from "@/services/gear.utils";
import { createRental } from "@/services/rentals";
import Cookies from "js-cookie";

export const CheckoutForm = ({ gear }: { gear: GearItem }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const totalDays = calculateDays(startDate, endDate);
  const estimatedCost = calculatePrice(Number(gear.dailyRate), totalDays);
  const isValid = totalDays > 0;

  const handleConfirm = async () => {
    const token = Cookies.get("accessToken");

    if (!token) {
      console.error("No access token found");
      alert("Please login to complete your checkout.");
      return;
    }

    const payload = {
      startDate,
      endDate,
      items: [
        {
          gearItemId: gear.id,
          quantity: 1,
        },
      ],
    };

    try {
      setLoading(true);
      const result = await createRental(payload, token);
      console.log(result);
    } catch (error) {
      console.error("Rental creation failed:", error);
    } finally {
      setLoading(false);
    }

    console.log(payload);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted/50 rounded-lg border text-sm space-y-1">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">Gear:</span>{" "}
            {gear.name}
          </p>
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">Price:</span>{" "}
            {`${gear.dailyRate} tk/day`}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Rental Start Date</Label>
            <Input
              type="date"
              value={startDate}
              min={today}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Rental End Date</Label>
            <Input
              type="date"
              value={endDate}
              min={startDate || today}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <p>
            <span className="font-semibold">Available:</span>{" "}
            {gear.availableQuantity}
          </p>
        </div>

        <div className="p-4 bg-muted/60 rounded-lg border text-sm space-y-1">
          <p className="text-muted-foreground">
            Total Days:{" "}
            <span className="font-bold text-foreground">{totalDays}</span>
          </p>
          <p className="text-muted-foreground">
            Estimated Cost:{" "}
            <span className="font-bold text-foreground">
              {estimatedCost} tk
            </span>
          </p>
        </div>

        <Button
          onClick={handleConfirm}
          type="button"
          className="w-full rounded-lg"
          disabled={!isValid}
        >
          Confirm Rental
        </Button>
      </CardContent>
    </Card>
  );
};
