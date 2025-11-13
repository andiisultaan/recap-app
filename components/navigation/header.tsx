"use client";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { GraduationCap } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-accent">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6" />
          <span className="text-sm font-medium">Rekap Sekolah</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
