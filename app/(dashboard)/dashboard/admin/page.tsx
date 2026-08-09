import { ArrowRight } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGears } from "@/services/gear";
import { getAllUsers } from "@/services/auth";
import { getAllRentalOrders } from "@/services/rentals";
import { CurrentUser } from "@/types/user.types";

const AdminPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  let users: CurrentUser[] = [];
  let gears: Awaited<ReturnType<typeof getGears>> = [];
  let orders: Awaited<ReturnType<typeof getAllRentalOrders>>["data"] = [];

  try {
    const [usersResult, gearsResult, ordersResult] = await Promise.all([
      getAllUsers(token),
      getGears(),
      getAllRentalOrders(token),
    ]);
    users = usersResult.data;
    gears = gearsResult;
    orders = ordersResult.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load stats";
    if (message === "Unauthorized") {
      redirect("/login");
    }
    throw err;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Link href="/dashboard/admin/users">
        <Card className="transition-colors hover:border-primary hover:shadow-md cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{users.length}</div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link href="/dashboard/admin/gear">
        <Card className="transition-colors hover:border-primary hover:shadow-md cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Gear
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{gears.length}</div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link href="/dashboard/admin/orders">
        <Card className="transition-colors hover:border-primary hover:shadow-md cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Rentals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{orders.length}</div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default AdminPage;