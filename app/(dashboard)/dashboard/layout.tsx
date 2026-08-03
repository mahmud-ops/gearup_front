import Navbar from "@/components/shared/Navbar";
import { RoleGuard } from "./role-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto py-8">
        <RoleGuard>{children}</RoleGuard>
      </main>
    </>
  );
}