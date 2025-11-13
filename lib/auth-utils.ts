import { cookies } from "next/headers";

export async function getAuthUserFromCookie() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth_user");

  if (!authCookie?.value) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(authCookie.value));
  } catch (e) {
    console.error("[v0] Failed to parse auth cookie:", e);
    return null;
  }
}

export async function setAuthUserCookie(userData: { nis: string; nama: string }) {
  const cookieStore = await cookies();
  const maxAge = 7 * 24 * 60 * 60; // 7 days

  cookieStore.set("auth_user", JSON.stringify(userData), {
    maxAge,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}

export async function clearAuthUserCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_user");
}
