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
  const [isOpen, setIsOpen] = useState(false);

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
    <nav className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b gap-4">
      <div className="flex items-center justify-between">
        {/* Logo as Home link */}
        <Link href="/" className="flex items-center">
          <img
            src="/gearup_logo.png"
            alt="GearUp Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden text-gray-700 focus:outline-none p-1"
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className={`${isOpen ? "flex" : "hidden"} sm:flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-sm font-medium`}>
        <Link href="/gear">Browse Gear</Link>
        <Link href="/auth/register?role=provider">Become a Provider</Link>
        {user && (
          <Link href={`/dashboard/${user.role.toLowerCase()}`}>Dashboard</Link>
        )}
      </div>

      {/* Auth Buttons */}
      <div className={`${isOpen ? "flex" : "hidden"} sm:flex flex-col sm:flex-row items-stretch sm:items-center gap-3`}>
        {user ? (
          <Button className="rounded-lg" onClick={logout}>
            Logout
          </Button>
        ) : (
          <>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant={"outline"} className={"rounded-lg w-full sm:w-auto"}>
                Login
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button className={"rounded-lg w-full sm:w-auto"}>Register</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;