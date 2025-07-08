"use client";

import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full border-b px-4 py-2 rounded-md max-w-[90vw] mx-auto mt-2 bg-white shadow-sm sticky top-0 z-50">
      <div className="container flex justify-between items-center py-4">
        <Link href="/" className="text-xl font-semibold">
          Fast OTT
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm hidden md:block text-muted-foreground">
                Hello, {user?.email}
              </span>

              {user?.role === "ADMIN" ? (
                <Link href="/admin/videos">
                  <Button variant="outline" size="sm">
                    Admin Panel
                  </Button>
                </Link>
              ) : (
                <></>
              )}

              <Button onClick={logout} variant="destructive" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <Link href="/auth/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
