"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        <nav className="flex gap-4 border-b pb-4">
          <Link href="/dashboard">
            <Button variant="ghost">Posts</Button>
          </Link>
          <Link href="/dashboard/categories">
            <Button variant="ghost">Categories</Button>
          </Link>
        </nav>

        <div>{children}</div>
      </div>
    </div>
  );
}
