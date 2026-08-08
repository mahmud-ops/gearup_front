"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import Cookies from "js-cookie";
import { logout } from "@/services/auth";
import { getCurrentUser } from "@/services/auth";
import { useEffect, useState } from "react";
import { CurrentUser } from "@/types/user.types";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (token) {
      const user = jwtDecode(token);
    }
    setMounted(true);
    (async () => {
      try {
        const currentUser = await getCurrentUser(token as string);
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      }
    })();
  }, []);

  if (!mounted) {
    return null; // or render a placeholder
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      {/* Logo as Home link */}
      <Link href="/" className="flex items-center">
        <img
          src="/gearup_logo.png"
          alt="GearUp Logo"
          className="h-10 w-auto object-contain"
        />
      </Link>

      {/* Main Navigation Links */}
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link href="/gear">Browse Gear</Link>
        <Link href="/auth/register?role=provider">Become a Provider</Link>
        {user && (
          <Link href={`/dashboard/${user.role.toLowerCase()}`}>Dashboard</Link>
        )}
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-3">
        {user ? (
          <Button className="rounded-lg" onClick={logout}>
            Logout
          </Button>
        ) : (
          <>
            <Link href="/login">
              <Button variant={"outline"} className={"rounded-lg"}>
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className={"rounded-lg"}>Register</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
