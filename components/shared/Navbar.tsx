"use client";
import { Button } from "../ui/button";
import Link from "next/link";
import Cookies from "js-cookie";
import { logout } from "@/services/auth";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or render a placeholder
  }
  const token = Cookies.get("accessToken");

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
        <a href="/gear">Browse Gear</a>
        <a href="/auth/register?role=provider">Become a Provider</a>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-3">
        {token ? (
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
