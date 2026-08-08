"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser } from "@/services/auth";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    const token = Cookies.get("accessToken");

    if (token) {
      const user = jwtDecode(token);
    }
    (async () => {
      try {
        const user = await getCurrentUser(token as string);
        if (cancelled) return;

        const requiredRole = pathname.split("/")[2];
        if (user.role.toLowerCase() !== requiredRole) {
          router.push(`/dashboard/${user.role.toLowerCase()}`);
        }
      } catch {
        if (cancelled) return;
        router.push("/login");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  return <>{children}</>;
}
