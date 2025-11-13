"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, DollarSign, Settings, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/absensi", label: "Absensi", icon: Users },
    { href: "/keuangan", label: "Keuangan", icon: DollarSign },
    { href: "/nilai", label: "Nilai", icon: ClipboardCheck },
    { href: "/settings", label: "Pengaturan", icon: Settings },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "default" : "ghost"}
              className={cn("flex-1 flex-col h-auto rounded-none py-3 gap-1", isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              <Link href={item.href} className="flex flex-col items-center gap-1 w-full">
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
