export interface NilaiData {
  replid: string;
  nis: string;
  nilaiAU: number;
  grade: string;
  komentar: string | null;
  pelajaran: {
    nama: string;
    kode: string;
  };
  semester: {
    semester: string | number;
  };
  kelas: {
    kelas: string;
  };
  tahunajaran: {
    tahunajaran: string;
    tglmulai: string;
    tglakhir: string;
    departemen: string;
  };
}

export function getGradeColor(grade: string): "default" | "secondary" | "outline" | "destructive" {
  switch (grade?.toUpperCase()) {
    case "A":
      return "default";
    case "B":
      return "secondary";
    case "C":
      return "outline";
    case "D":
      return "destructive";
    default:
      return "default";
  }
}
