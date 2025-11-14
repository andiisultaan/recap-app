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
import { useAuth } from "@/lib/auth-context";
import type { NilaiData } from "./types";
import { getGradeColor } from "./types";

export default function NilaiPage() {
  const [data, setData] = useState<NilaiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedPelajaran, setSelectedPelajaran] = useState<string>("");

  const { user } = useAuth();
  const nis = user?.nis || "";

  useEffect(() => {
    const fetchNilaiData = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = `
          query($nis: String!) {
            nauByNis(nis: $nis) {
              replid
              nis
              nilaiAU
              grade
              komentar
              pelajaran {
                nama
                kode
              }
              semester {
                semester
                replid
              }
            }
          }
        `;

        const response = await fetch("http://backend.smkmutu-pku.web.id:4000/graphql", {
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

        setData(result.data?.nauByNis || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNilaiData();
  }, [nis]);

  const uniqueSemesters = useMemo(() => {
    const semesters = [...new Set(data.map(r => r.semester.semester))].sort((a, b) => {
      const aNum = typeof a === "string" ? Number.parseInt(a, 10) : a;
      const bNum = typeof b === "string" ? Number.parseInt(b, 10) : b;
      return aNum - bNum;
    });
    return semesters;
  }, [data]);

  const uniquePelajaran = useMemo(() => {
    const pelajaran = [...new Set(data.map(r => r.pelajaran.nama))].sort();
    return pelajaran;
  }, [data]);

  const stats = useMemo(() => {
    const nilaiArray = data.map(r => r.nilaiAU);
    const rataRata = nilaiArray.length > 0 ? nilaiArray.reduce((a, b) => a + b) / nilaiArray.length : 0;
    const tertinggi = nilaiArray.length > 0 ? Math.max(...nilaiArray) : 0;
    const terendah = nilaiArray.length > 0 ? Math.min(...nilaiArray) : 0;

    return {
      rataRata: rataRata.toFixed(2),
      tertinggi,
      terendah,
      total: data.length,
    };
  }, [data]);

  const filteredData = useMemo(() => {
    let result = data;

    if (selectedSemester) {
      result = result.filter(r => String(r.semester.semester) === selectedSemester);
    }

    if (selectedPelajaran) {
      result = result.filter(r => r.pelajaran.nama === selectedPelajaran);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r => r.pelajaran.nama.toLowerCase().includes(query) || r.pelajaran.kode.toLowerCase().includes(query) || r.grade.toLowerCase().includes(query));
    }

    return result;
  }, [data, searchQuery, selectedSemester, selectedPelajaran]);

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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="text-sm font-medium block mb-1">Filter Semester</label>
                <select
                  value={selectedSemester}
                  onChange={e => {
                    setSelectedSemester(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-10 rounded-md bg-input text-foreground shadow-sm border border-input px-3 py-2"
                >
                  <option value="">Semua Semester</option>
                  {uniqueSemesters.map(semester => (
                    <option key={semester} value={semester}>
                      Semester {semester}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Pilih Mata Pelajaran</label>
                <select
                  value={selectedPelajaran}
                  onChange={e => {
                    setSelectedPelajaran(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-10 rounded-md bg-input text-foreground shadow-sm border border-input px-3 py-2"
                >
                  <option value="">Semua Mata Pelajaran</option>
                  {uniquePelajaran.map(pelajaran => (
                    <option key={pelajaran} value={pelajaran}>
                      {pelajaran}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Cari Pelajaran / Kode / Grade</label>
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
            </div>

            {(selectedSemester || selectedPelajaran || searchQuery) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedSemester("");
                  setSelectedPelajaran("");
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="text-xs"
              >
                Reset Semua Filter
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <Card className="text-center">
              <CardContent className="pt-6 pb-6">
                <div className="text-3xl sm:text-2xl font-semibold">{stats.rataRata}</div>
                <div className="text-sm sm:text-xs text-muted-foreground mt-2">Rata-Rata</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6 pb-6">
                <div className="text-3xl sm:text-2xl font-semibold text-green-600">{stats.tertinggi}</div>
                <div className="text-sm sm:text-xs text-muted-foreground mt-2">Tertinggi</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6 pb-6">
                <div className="text-3xl sm:text-2xl font-semibold text-yellow-600">{stats.terendah}</div>
                <div className="text-sm sm:text-xs text-muted-foreground mt-2">Terendah</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6 pb-6">
                <div className="text-3xl sm:text-2xl font-semibold text-blue-600">{stats.total}</div>
                <div className="text-sm sm:text-xs text-muted-foreground mt-2">Total Nilai</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Data Nilai Akademik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paginatedData.length > 0 ? (
                <>
                  <div className="hidden md:block overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
                    <Table>
                      <THead>
                        <TR>
                          <TH className="text-sm sm:text-base">Pelajaran</TH>
                          <TH className="text-sm sm:text-base">Kode</TH>
                          <TH className="text-sm sm:text-base">Nilai</TH>
                          <TH className="text-sm sm:text-base">Grade</TH>
                          <TH className="text-sm sm:text-base">Semester</TH>
                          <TH className="text-sm sm:text-base">Komentar</TH>
                        </TR>
                      </THead>
                      <TBody>
                        {paginatedData.map(r => (
                          <TR key={r.replid}>
                            <TD className="font-medium text-sm sm:text-base">{r.pelajaran.nama}</TD>
                            <TD className="text-sm sm:text-base">{r.pelajaran.kode}</TD>
                            <TD className="text-sm sm:text-base font-semibold">{r.nilaiAU}</TD>
                            <TD className="text-sm sm:text-base">
                              <Badge variant={getGradeColor(r.grade)}>{r.grade}</Badge>
                            </TD>
                            <TD className="text-sm sm:text-base text-center">Semester {r.semester.semester}</TD>
                            <TD className="text-sm sm:text-base max-w-[150px] truncate overflow-hidden whitespace-nowrap" title={r.komentar || undefined}>
                              {r.komentar || "-"}
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
                            <div className="text-xs font-semibold text-muted-foreground uppercase">Pelajaran</div>
                            <div className="font-medium text-sm">{r.pelajaran.nama}</div>
                          </div>
                          <Badge variant={getGradeColor(r.grade)}>{r.grade}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-xs font-semibold text-muted-foreground uppercase">Nilai</div>
                            <div>{r.nilaiAU}</div>
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-muted-foreground uppercase">Kode</div>
                            <div>{r.pelajaran.kode}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground uppercase">Semester</div>
                          <div className="text-sm">Semester {r.semester.semester}</div>
                        </div>
                        {r.komentar && (
                          <div>
                            <div className="text-xs font-semibold text-muted-foreground uppercase">Komentar</div>
                            <div className="text-sm">{r.komentar}</div>
                          </div>
                        )}
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
                <div className="text-center py-8 text-muted-foreground">Memuat data nilai akademik...</div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">Tidak ada data nilai akademik</div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
