import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props = {
  params: {
    gearId: string;
  };
};

const GearCheckoutPage = ({ params }: Props) => {
  const { gearId } = params;

  return (
    <div className="max-w-md mx-auto my-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Gear Summary */}
          <div className="p-4 bg-muted/50 rounded-lg border text-sm space-y-1">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Gear:</span>{" "}
              Mountain Bike
            </p>
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Price:</span>{" "}
              $35/day
            </p>
          </div>

          {/* Date Selection Inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Rental Start Date</Label>
              <Input type="date" id="startDate" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Rental End Date</Label>
              <Input type="date" id="endDate" />
            </div>
          </div>

          {/* Summary (Disabled Section) */}
          <div className="p-4 bg-muted/60 rounded-lg border text-sm space-y-1 select-none pointer-events-none opacity-60">
            <p className="text-muted-foreground">
              Total Days: <span className="font-bold text-foreground">0</span>
            </p>
            <p className="text-muted-foreground">
              Estimated Cost:{" "}
              <span className="font-bold text-foreground">$0</span>
            </p>
          </div>

          {/* Confirm Button */}
          <Button type="button" className="w-full">
            Confirm Rental
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GearCheckoutPage;
