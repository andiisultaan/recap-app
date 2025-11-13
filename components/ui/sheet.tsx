"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Sheet({ open, onOpenChange, children }: { open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode }) {
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/30" onClick={() => onOpenChange(false)} />}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-80 translate-x-full bg-white p-4 shadow-soft transition-transform dark:bg-slate-950",
          open && "translate-x-0"
        )}
      >
        {children}
      </div>
    </>
  );
}


