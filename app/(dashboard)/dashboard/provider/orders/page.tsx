import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getProviderOrders } from "@/services/rentals";
import ProviderOrdersClient from "@/components/shared/ProviderOrdersClient";
import { RentalOrder } from "@/types/rental.types";

const ProviderOrdersPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  let orders: RentalOrder[];
  let error: string | null = null;

  try {
    const result = await getProviderOrders(token);
    orders = result.data ?? [];
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load orders";
    if (message === "Unauthorized") {
      redirect("/login");
    }
    error = message;
    orders = [];
  }

  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Provider Orders</h1>
        <p className="text-sm text-muted-foreground">
          Manage incoming rental orders
        </p>
      </div>
      <ProviderOrdersClient initialOrders={orders} error={error} />
    </div>
  );
};

export default ProviderOrdersPage;
