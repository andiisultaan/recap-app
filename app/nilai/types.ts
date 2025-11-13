// Define the NilaiData type and getGradeColor function here

export type NilaiData = {
  replid: string;

  nis: string;

  nilaiAU: number;

  grade: string;

  komentar: string;

  pelajaran: {
    nama: string;

    kode: string;
  };

  semester: {
    semester: number;

    replid: string;
  };
};

export const getGradeColor = (grade: string): "destructive" | "secondary" | "default" | "outline" => {
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
      return "outline";
  }
};
