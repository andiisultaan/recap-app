"use client";

import { useEffect, useState, useMemo } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Header } from "@/components/navigation/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/auth-context";

interface BesarJtt {
  replid: string;
  nis: string;
  besar: number;
  cicilan: number;
  lunas: number;
  keterangan: string;
  idpenerimaan: string;
}

interface JurnalTransaksi {
  replid: string;
  tanggal: string;
  transaksi: string;
}

interface Penerimaan {
  replid: string;
  tanggal: string;
  petugas: string;
}

interface LaporanKeuangan {
  nis: string;
  totalBesar: number;
  totalCicilan: number;
  totalLunas: number;
  totalSisa: number;
  besarJttList: BesarJtt[];
  jurnalList: JurnalTransaksi[];
  penerimaanList: Penerimaan[];
}

interface UnifiedData {
  type: "tagihan" | "jurnal" | "penerimaan";
  data: BesarJtt | JurnalTransaksi | Penerimaan;
}

const ITEMS_PER_PAGE = 10;

const Page = () => {
  const { user } = useAuth();
  const nis = user?.nis;
  const [laporan, setLaporan] = useState<LaporanKeuangan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchBulan, setSearchBulan] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const query = `
          query LaporanKeuanganSiswa($nis: String!) {
            laporanKeuanganSiswa(nis: $nis) {
              nis
              totalBesar
              totalCicilan
              totalLunas
              totalSisa
              besarJttList {
                replid
                nis
                besar
                cicilan
                lunas
                keterangan
                idpenerimaan
              }
              jurnalList {
                replid
                tanggal
                transaksi
              }
              penerimaanList {
                replid
                tanggal
                petugas
              }
            }
          }
        `;

        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            variables: { nis },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0]?.message || "GraphQL error");
        }

        setLaporan(result.data?.laporanKeuanganSiswa || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (nis) {
      fetchData();
    }
  }, [nis]);

  const filtered = useMemo(() => {
    if (!laporan) return [];

    return laporan.besarJttList.map((item, index) => ({
      besarJtt: item,
      jurnal: laporan.jurnalList[index] || { replid: "", tanggal: "", transaksi: "" },
    }));
  }, [laporan]);

  const filteredBySearch = useMemo(() => {
    if (!laporan) return [];

    return filtered.filter(item => {
      if (!searchBulan) return true;
      return item.jurnal.transaksi.toLowerCase().includes(searchBulan.toLowerCase());
    });
  }, [filtered, searchBulan]);

  const totalPages = Math.ceil((laporan?.besarJttList?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto flex max-w-5xl gap-4 px-4 pb-24 pt-4 md:pb-6">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 space-y-3 md:space-y-6">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3 md:gap-4">
            <Card className="text-center">
              <CardContent className="p-3 md:p-6">
                <div className="text-xs md:text-sm text-muted-foreground">Total Besar</div>
                <div className="mt-2 text-xl md:text-3xl font-semibold text-blue-600">Rp{laporan?.totalBesar.toLocaleString("id-ID") || "0"}</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3 md:p-6">
                <div className="text-xs md:text-sm text-muted-foreground">Sudah Dibayar</div>
                <div className="mt-2 text-xl md:text-3xl font-semibold text-emerald-600">Rp{laporan?.totalCicilan.toLocaleString("id-ID") || "0"}</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3 md:p-6">
                <div className="text-xs md:text-sm text-muted-foreground">Belum Dibayar</div>
                <div className="mt-2 text-xl md:text-3xl font-semibold text-rose-600">Rp{laporan?.totalSisa.toLocaleString("id-ID") || "0"}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2 md:pb-6">
              <CardTitle className="text-base md:text-lg">Filter</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Input type="text" placeholder="Cari..." value={searchBulan} onChange={e => setSearchBulan(e.target.value)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 md:pb-6">
              <CardTitle className="text-base md:text-lg">Rekap Keuangan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner />
                </div>
              ) : error ? (
                <div className="p-3 md:p-4 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
                  <p className="font-semibold">Error: {error}</p>
                </div>
              ) : null}

              <div className="md:hidden space-y-2">
                {filteredBySearch?.slice(startIndex, startIndex + ITEMS_PER_PAGE).map(item => (
                  <div key={item.besarJtt.replid} className="border border-slate-200 rounded-lg p-3 space-y-2">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Keterangan</div>
                      <div className="text-sm font-medium">{item.jurnal.transaksi}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Tanggal</div>
                        <div className="text-xs font-semibold">{item.jurnal.tanggal}</div>
                      </div>
                      {/* <div>
                        <div className="text-xs text-muted-foreground mb-1">Besar</div>
                        <div className="text-xs font-semibold">Rp{item.besarJtt.besar.toLocaleString("id-ID")}</div>
                      </div> */}
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Cicilan</div>
                        <div className="text-xs font-semibold">Rp{item.besarJtt.cicilan.toLocaleString("id-ID")}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <THead>
                    <TR>
                      <TH className="text-xs md:text-sm">Keterangan</TH>
                      <TH className="text-xs md:text-sm">Tanggal</TH>
                      {/* <TH className="text-xs md:text-sm text-right">Besar</TH> */}
                      <TH className="text-xs md:text-sm text-right">Cicilan</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {filteredBySearch?.slice(startIndex, startIndex + ITEMS_PER_PAGE).map(item => (
                      <TR key={item.besarJtt.replid}>
                        <TD className="text-xs md:text-sm">{item.jurnal.transaksi}</TD>
                        <TD className="text-xs md:text-sm">{item.jurnal.tanggal}</TD>
                        {/* <TD className="text-xs md:text-sm text-right">Rp{item.besarJtt.besar.toLocaleString("id-ID")}</TD> */}
                        <TD className="text-xs md:text-sm text-right">Rp{item.besarJtt.cicilan.toLocaleString("id-ID")}</TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </div>

              {(laporan?.besarJttList?.length || 0) > ITEMS_PER_PAGE && (
                <div className="flex flex-col items-center justify-between gap-3 md:gap-4 pt-4 md:pt-6 md:flex-row">
                  <div className="text-xs md:text-sm text-slate-600 text-center md:text-left">
                    Halaman {currentPage} dari {totalPages} ({laporan?.besarJttList?.length || 0} data)
                  </div>
                  <div className="flex gap-1 flex-wrap justify-center">
                    <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} size="sm" className="text-xs md:text-sm">
                      Sebelumnya
                    </Button>
                    <div className="flex gap-0.5">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button key={page} variant={currentPage === page ? "default" : "outline"} onClick={() => setCurrentPage(page)} className="h-8 w-8 md:h-9 md:w-9 p-0 text-xs">
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} size="sm" className="text-xs md:text-sm">
                      Selanjutnya
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default Page;
