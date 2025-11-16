"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface LoginResponse {
  data: {
    login: {
      success: boolean;
      message: string;
      data?: {
        nis: string;
        nama: string;
      };
    };
  };
}

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [nis, setNis] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGraphQLLogin = async (nisValue: string, pinValue: string): Promise<LoginResponse | null> => {
    const query = `
      query Login($nis: String!, $pin: String!) {
        login(nis: $nis, pin: $pin) {
          success
          message
          data {
            nis
            nama
          }
        }
      }
    `;

    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: {
            nis: nisValue,
            pin: pinValue,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result: LoginResponse = await response.json();
      return result;
    } catch (err) {
      console.error("[v0] GraphQL Error:", err);
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!nis.trim()) {
      setError("NIS tidak boleh kosong");
      return;
    }

    if (!pin.trim()) {
      setError("PIN tidak boleh kosong");
      return;
    }

    if (pin.length < 4) {
      setError("PIN harus minimal 4 digit");
      return;
    }

    setIsLoading(true);
    try {
      const result = await handleGraphQLLogin(nis, pin);

      if (result?.data?.login?.success) {
        const userData = result.data.login.data;
        if (userData) {
          login(userData);
          router.push("/");
        }
      } else {
        setError(result?.data?.login?.message || "Login gagal. Silakan coba lagi.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login. Silakan coba lagi.");
      console.error("[v0] Login Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2h2v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Absen & Keuangan</h1>
        <p className="text-gray-600 text-sm">Masuk untuk melihat rekapitulasi absensi dan keuangan</p>
      </div>

      {/* Form Card */}
      <Card className="p-6 md:p-8 shadow-lg border-0 bg-white">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* NIS Input */}
          <div className="space-y-2">
            <label htmlFor="nis" className="block text-sm font-semibold text-gray-700">
              Nomor Induk Siswa (NIS)
            </label>
            <Input
              id="nis"
              type="text"
              placeholder="Masukkan NIS Anda"
              value={nis}
              onChange={e => setNis(e.target.value)}
              disabled={isLoading}
              className="h-10 text-base border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          {/* PIN Input */}
          <div className="space-y-2">
            <label htmlFor="pin" className="block text-sm font-semibold text-gray-700">
              PIN (Password)
            </label>
            <Input
              id="pin"
              type="password"
              placeholder="Masukkan PIN Anda"
              value={pin}
              onChange={e => setPin(e.target.value)}
              disabled={isLoading}
              maxLength={6}
              className="h-10 text-base border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent tracking-widest bg-white"
            />
            <p className="text-xs text-gray-500">PIN terdiri dari 4-6 digit</p>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 mt-6 shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sedang masuk...</span>
              </div>
            ) : (
              "Masuk"
            )}
          </Button>

          {/* Forgot PIN Link */}
          {/* <div className="text-center pt-2">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Lupa PIN?
            </a>
          </div> */}
        </form>

        {/* Footer Info */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs text-gray-600">
          <p>Keamanan data Anda adalah prioritas kami</p>
        </div>
      </Card>
    </div>
  );
}
