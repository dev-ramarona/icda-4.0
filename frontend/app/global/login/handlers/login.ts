"use server";

import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/backend";
import { setSessionCookies, TokenPair } from "@/lib/session";

export type LoginState = {
  error?: string;
};

// Login action
export async function HandlerLogin(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!username || !password)
    return { error: "username dan password wajib diisi" };
  const res = await backendFetch<TokenPair & { error?: string }>(
    "/icda/v1/user/login",
    { method: "POST", body: { username, password } },
  );
  if (!res.ok) {
    if (res.status == 0) return { error: "Server offline" };
    return { error: res.data.error ?? "Wrong Password or username" };
  }
  await setSessionCookies(res.data);
  redirect("/private");
}
