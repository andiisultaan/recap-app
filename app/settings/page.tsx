"use client";

import { Sidebar } from "@/components/navigation/sidebar";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Header } from "@/components/navigation/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import rekapData from "@/data/rekap-siswa.json";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

const siswa = rekapData.siswa;

export default function Page() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const nama = user?.nama || "Siswa";
  const nis = user?.nis || "000000";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto flex max-w-5xl gap-4 px-4 pb-24 pt-4 md:pb-6">
        <Sidebar />
        <main className="flex-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Siswa</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <div className="text-xs text-slate-500">Nama</div>
                <div className="font-semibold">{nama}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">NIS</div>
                <div className="font-semibold">{nis}</div>
              </div>
            </CardContent>
          </Card>
          <div>
            <Button onClick={handleLogout} className="bg-rose-600 hover:bg-rose-700 text-white w-full">
              Logout
            </Button>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
