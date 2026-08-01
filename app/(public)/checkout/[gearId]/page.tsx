import React from "react";
import { getGear } from "@/services/gear";
import { GearItem } from "@/types/gear.types";
import { CheckoutForm } from "@/components/shared/CheckoutForm";

type Props = {
  params: Promise<{
    gearId: string;
  }>;
};

const GearCheckoutPage = async ({ params }: Props) => {
  const { gearId } = await params;
  const gear: GearItem = await getGear(gearId);

  return (
    <div className="max-w-md mx-auto my-8">
      <CheckoutForm gear={gear} />
    </div>
  );
};

export default GearCheckoutPage;