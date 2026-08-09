import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/services/auth";
import { getGears } from "@/services/gear";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import React from "react";
import { getProviderOrders } from "@/services/rentals";
import { InventoryButton } from "@/components/shared/InventoryButton";

const Providerpage = async () => {
  const gears = await getGears();

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  const orders = await getProviderOrders(token);
  const user = await getCurrentUser(token);
  const gearCount = gears.filter((g) => g.providerId === user.id).length;
  const orderCount = orders.data.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Gear
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{gearCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{orderCount}</div>
        </CardContent>
      </Card>
      <InventoryButton />
    </div>

  );
};

export default Providerpage;