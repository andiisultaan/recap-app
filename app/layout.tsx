import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/protected-route";

export const metadata: Metadata = {
  title: "Rekap Absensi & Kuangan",
  description: "Rekap absensi dan keuangan sekolah",
  icons: "/graduation-cap.ico",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ProtectedRoute>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
