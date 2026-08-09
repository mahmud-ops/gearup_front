import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getGears } from "@/services/gear";
import { getCurrentUser } from "@/services/auth";
import { GearItem } from "@/types/gear.types";
import GearTableClient from "@/components/shared/GearTableClient";

const ProviderGearPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  const user = await getCurrentUser(token);
  const gears: GearItem[] = await getGears();

  const providerGears = gears.filter((g) => g.providerId === user.id);

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <GearTableClient gears={providerGears} />
    </div>
  );
};

export default ProviderGearPage;
