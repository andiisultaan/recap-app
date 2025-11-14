"use client";

import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Header } from "@/components/navigation/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/datepicker";
import { useAuth } from "@/lib/auth-context";

interface Kelas {
  kelas: string;
}

interface Pelajaran {
  nama: string;
}

interface PresensiPelajaran {
  replid: string;
  tanggal: string;
  jam: string;
  gurupelajaran: string;
  materi: string;
  statushadir: number;
  kelas: Kelas;
  pelajaran: Pelajaran;
}

const getStatusLabel = (statusCode: number | string): string => {
  const statusMap: Record<number | string, string> = {
    0: "Hadir",
    1: "Sakit",
    2: "Ijin",
    3: "Alpha",
    4: "Cuti",
  };
  return statusMap[statusCode] || "Unknown";
};

const getStatusColor = (statusCode: number | string): "destructive" | "secondary" | "default" | "outline" => {
  switch (statusCode) {
    case 0:
      return "default";
    case 1:
      return "outline";
    case 2:
      return "secondary";
    case 3:
      return "outline";
    case 4:
      return "secondary";
    default:
      return "secondary";
  }
};

export default function Page() {
  const [data, setData] = useState<PresensiPelajaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { user } = useAuth();
  const nis = user?.nis || "";

  useEffect(() => {
    const fetchPresensiData = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = `
          query($nis: String!) {
            presensiPelajaranByNis(nis: $nis) {
              replid
              tanggal
              jam
              gurupelajaran
              materi
              statushadir
              kelas {
                kelas
              }
              pelajaran {
                nama
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
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0]?.message || "GraphQL error");
        }

        setData(result.data?.presensiPelajaranByNis || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPresensiData();
  }, [nis]);

  const stats = useMemo(() => {
    return {
      hadir: data.filter(r => r.statushadir === 0).length,
      izin: data.filter(r => r.statushadir === 2).length,
      alpha: data.filter(r => r.statushadir === 3).length,
      total: data.length,
    };
  }, [data]);

  const filteredData = useMemo(() => {
    let result = data;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r => r.pelajaran.nama.toLowerCase().includes(query) || r.gurupelajaran.toLowerCase().includes(query) || r.materi.toLowerCase().includes(query));
    }

    if (startDate) {
      const start = new Date(startDate);
      result = result.filter(r => new Date(r.tanggal) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(r => new Date(r.tanggal) <= end);
    }

    return result;
  }, [data, searchQuery, startDate, endDate]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto flex max-w-5xl gap-4 px-4 pb-24 pt-4 md:pb-6">
        <Sidebar />
        <main className="flex-1 space-y-4">
          {error && (
            <Card className="border-destructive bg-destructive/10">
              <CardContent className="pt-6">
                <p className="text-destructive text-sm">{error}</p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3 border-b pb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium block mb-1">Cari Pelajaran / Guru / Materi</label>
                <Input
                  placeholder="Ketik untuk mencari..."
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10 rounded-md bg-input text-foreground shadow-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Dari Tanggal</label>
                <DatePicker
                  value={startDate}
                  onChange={date => {
                    setStartDate(date);
                    setCurrentPage(1);
                  }}
                  placeholder="Pilih tanggal mulai"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Sampai Tanggal</label>
                <DatePicker
                  value={endDate}
                  onChange={date => {
                    setEndDate(date);
                    setCurrentPage(1);
                  }}
                  placeholder="Pilih tanggal akhir"
                />
              </div>
            </div>
            {(searchQuery || startDate || endDate) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStartDate("");
                  setEndDate("");
                  setCurrentPage(1);
                }}
                className="text-xs"
              >
                Reset Filter
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <Card className="text-center">
              <CardContent className="pt-6 pb-6">
                <div className="text-3xl sm:text-2xl font-semibold">{stats.total}</div>
                <div className="text-sm sm:text-xs text-muted-foreground mt-2">Total Absen</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6 pb-6">
                <div className="text-3xl sm:text-2xl font-semibold text-green-600">{stats.hadir}</div>
                <div className="text-sm sm:text-xs text-muted-foreground mt-2">Hadir</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6 pb-6">
                <div className="text-3xl sm:text-2xl font-semibold text-yellow-600">{stats.izin}</div>
                <div className="text-sm sm:text-xs text-muted-foreground mt-2">Ijin</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6 pb-6">
                <div className="text-3xl sm:text-2xl font-semibold text-red-600">{stats.alpha}</div>
                <div className="text-sm sm:text-xs text-muted-foreground mt-2">Alpha</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rekap Presensi Pelajaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paginatedData.length > 0 ? (
                <>
                  <div className="hidden md:block overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
                    <Table>
                      <THead>
                        <TR>
                          <TH className="text-sm sm:text-base">Tanggal</TH>
                          <TH className="text-sm sm:text-base">Jam</TH>
                          <TH className="text-sm sm:text-base">Pelajaran</TH>
                          <TH className="text-sm sm:text-base">Guru Pelajaran</TH>
                          <TH className="text-sm sm:text-base">Materi</TH>
                          <TH className="text-sm sm:text-base">Kelas</TH>
                          <TH className="text-sm sm:text-base">Status</TH>
                        </TR>
                      </THead>
                      <TBody>
                        {paginatedData.map(r => (
                          <TR key={r.replid}>
                            <TD className="font-medium text-sm sm:text-base">
                              {new Date(r.tanggal).toLocaleDateString("id-ID", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </TD>
                            <TD className="text-sm sm:text-base">{r.jam}</TD>
                            <TD className="text-sm sm:text-base">{r.pelajaran.nama}</TD>
                            <TD className="text-sm sm:text-base">{r.gurupelajaran}</TD>
                            <TD className="text-sm sm:text-base max-w-xs truncate">{r.materi}</TD>
                            <TD className="text-sm sm:text-base">{r.kelas.kelas}</TD>
                            <TD className="text-sm sm:text-base">
                              <Badge variant={getStatusColor(r.statushadir)}>{getStatusLabel(r.statushadir)}</Badge>
                            </TD>
                          </TR>
                        ))}
                      </TBody>
                    </Table>
                  </div>

                  <div className="md:hidden space-y-3">
                    {paginatedData.map(r => (
                      <div key={r.replid} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-1 flex-1">
                            <div className="text-xs font-semibold text-muted-foreground uppercase">Tanggal</div>
                            <div className="font-medium text-sm">
                              {new Date(r.tanggal).toLocaleDateString("id-ID", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                          <Badge variant={getStatusColor(r.statushadir)}>{getStatusLabel(r.statushadir)}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-xs font-semibold text-muted-foreground uppercase">Jam</div>
                            <div>{r.jam}</div>
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-muted-foreground uppercase">Kelas</div>
                            <div>{r.kelas.kelas}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground uppercase">Pelajaran</div>
                          <div>{r.pelajaran.nama}</div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground uppercase">Guru Pelajaran</div>
                          <div>{r.gurupelajaran}</div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground uppercase">Materi</div>
                          <div>{r.materi}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Halaman {currentPage} dari {totalPages} ({filteredData.length} data)
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="text-xs sm:text-sm">
                        Sebelumnya
                      </Button>
                      <div className="flex items-center gap-1 flex-wrap justify-center">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)} className="w-8 h-8 p-0 text-xs">
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="text-xs sm:text-sm">
                        Selanjutnya
                      </Button>
                    </div>
                  </div>
                </>
              ) : loading ? (
                <div className="text-center py-8 text-muted-foreground">Memuat data presensi pelajaran...</div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">Tidak ada data presensi pelajaran</div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
