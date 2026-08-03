import Navbar from "@/components/shared/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto py-8">
        {children}
      </main>
    </>
  );
}