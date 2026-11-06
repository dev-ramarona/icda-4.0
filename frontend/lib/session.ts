"use server";
import { screensType } from "@/app/private/user/models/model";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Model get refresh token
export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

// Store cookies
export async function setSessionCookies(tokens: TokenPair) {
  const store = await cookies();
  store.set("access_token", tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: tokens.expires_in,
  });

  store.set("refresh_token", tokens.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export type payloadJWT = {
  username: string;
  namefull: string;
  formatkey: string[];
  permitkey: string[];
  screens: screensType[];
  role: string;
  exp: number;
};

// Clear cookies
export async function clearAllToken() {
  const store = await cookies();
  store.delete("access_token");
  store.delete("refresh_token");
  redirect("/global");
}

// Get cookies
export async function getAccessToken() {
  const store = await cookies();
  return store.get("access_token")?.value ?? "";
}

// Get cookies
export async function getRefreshToken() {
  const store = await cookies();
  return store.get("refresh_token")?.value ?? "";
}

// Verify and breakdown token
export async function verifyAccessToken(token: string) {
  const accessSecretKey = new TextEncoder().encode(
    process.env.JWT_ACCESS_SECRET,
  );
  try {
    const { payload } = await jwtVerify(token, accessSecretKey);
    return payload as payloadJWT;
  } catch {
    const payload: payloadJWT = {
      username: "",
      namefull: "",
      formatkey: [""],
      permitkey: [""],
      screens: [],
      role: "",
      exp: 0,
    };
    return payload;
  }
}
