"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AdminGearTableClient from "@/components/shared/AdminGearTableClient";

export default function AdminGearPage() {
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    setHasToken(!!token);
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  if (!hasToken) return null;

  return <AdminGearTableClient />;
}
