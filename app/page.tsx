"use client";

import { Sidebar } from "@/components/navigation/sidebar";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Header } from "@/components/navigation/header";
import { Card } from "@/components/ui/card";
import { Info, Package, Zap, Shield, Globe, Code } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function Page() {
  const { user } = useAuth();
  const nama = user?.nama || "Siswa";

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto flex max-w-5xl gap-4 px-4 pb-24 pt-4 md:pb-6">
        <Sidebar />
        <main className="flex-1">
          <div className="space-y-6">
            {/* Application Header */}
            <div className="rounded-lg bg-linear-to-r from-slate-50 to-slate-100 p-6 dark:from-slate-950/30 dark:to-slate-900/30 md:p-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">Selamat Datang, {nama}👋</h1>
              </div>
            </div>

            {/* Application Features */}
            <div>
              <h2 className="mb-3 text-lg font-semibold sm:text-xl">Fitur Utama</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
                <Card className="flex flex-col gap-3 p-4 sm:p-6">
                  <div className="rounded-lg bg-blue-100 p-2 w-fit dark:bg-blue-950">
                    <Package className="h-5 w-5 text-blue-600 dark:text-blue-400 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Manajemen Data</h3>
                    <p className="text-xs text-muted-foreground sm:text-sm mt-1">Kelola dan organisir data Anda dengan mudah melalui dashboard intuitif.</p>
                  </div>
                </Card>

                <Card className="flex flex-col gap-3 p-4 sm:p-6">
                  <div className="rounded-lg bg-green-100 p-2 w-fit dark:bg-green-950">
                    <Zap className="h-5 w-5 text-green-600 dark:text-green-400 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Performa Cepat</h3>
                    <p className="text-xs text-muted-foreground sm:text-sm mt-1">Sistem yang responsif dengan waktu loading minimal untuk produktivitas maksimal.</p>
                  </div>
                </Card>

                <Card className="flex flex-col gap-3 p-4 sm:p-6">
                  <div className="rounded-lg bg-purple-100 p-2 w-fit dark:bg-purple-950">
                    <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Keamanan Terjamin</h3>
                    <p className="text-xs text-muted-foreground sm:text-sm mt-1">Enkripsi end-to-end dan autentikasi berlapis untuk melindungi data Anda.</p>
                  </div>
                </Card>

                <Card className="flex flex-col gap-3 p-4 sm:p-6">
                  <div className="rounded-lg bg-orange-100 p-2 w-fit dark:bg-orange-950">
                    <Globe className="h-5 w-5 text-orange-600 dark:text-orange-400 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Akses Di Mana Saja</h3>
                    <p className="text-xs text-muted-foreground sm:text-sm mt-1">Akses aplikasi dari perangkat apa pun, kapan pun Anda membutuhkannya.</p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Technology Stack */}
            {/* <Card className="p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-950 mt-1">
                    <Code className="h-5 w-5 text-indigo-600 dark:text-indigo-400 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Teknologi</h3>
                    <p className="text-xs text-muted-foreground sm:text-sm mt-1">Dibangun dengan React, Next.js, TypeScript, dan Tailwind CSS untuk pengalaman pengguna yang optimal.</p>
                  </div>
                </div>
              </div>
            </Card> */}

            {/* System Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <Card className="p-4 sm:p-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Versi Aplikasi</p>
                  <p className="text-xl sm:text-2xl font-bold">v1.0.0</p>
                </div>
              </Card>

              {/* <Card className="p-4 sm:p-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status Server</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <p className="text-sm sm:text-base font-medium">Online</p>
                  </div>
                </div>
              </Card> */}
            </div>

            {/* Important Notice */}
            {/* <Card className="border-l-4 border-l-amber-500 p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0 sm:h-6 sm:w-6" />
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-sm sm:text-base">Pemberitahuan Penting</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">Pemeliharaan sistem dijadwalkan setiap hari Minggu pukul 23:00 - 24:00 WIB. Aplikasi mungkin tidak dapat diakses selama periode tersebut.</p>
                </div>
              </div>
            </Card> */}
          </div>
        </main>
      </div>
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
