"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, DollarSign, Settings, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/absensi", label: "Absensi", icon: Users },
  { href: "/keuangan", label: "Keuangan", icon: DollarSign },
  { href: "/nilai", label: "Nilai", icon: ClipboardCheck },
  { href: "/settings", label: "Pengaturan", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-sidebar md:flex">
      <div className="p-6">
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>
      <nav className="flex-1 space-y-2 px-4">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors", isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent")}>
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
