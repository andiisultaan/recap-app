import { Sidebar } from "@/components/navigation/sidebar";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Header } from "@/components/navigation/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import sekolah from "@/data/sekolah.json";

export default function Page() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto flex max-w-5xl gap-4 px-4 pb-24 pt-4 md:pb-6">
        <Sidebar />
        <main className="flex-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profil Sekolah</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="font-medium">{sekolah.nama}</div>
              <div>Alamat: {sekolah.alamat}</div>
              <div>Telepon: {sekolah.telepon}</div>
              <div>Email: {sekolah.email}</div>
            </CardContent>
          </Card>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
