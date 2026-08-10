import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CategoryManagement from "@/components/shared/CategoryManagement";

export default async function AdminCategoriesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <CategoryManagement />
    </div>
  );
}
