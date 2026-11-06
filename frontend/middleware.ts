import { jwtVerify } from "jose";
import { backendFetch } from "./lib/backend";
import { NextRequest, NextResponse } from "next/server";
import { TokenPair } from "./lib/session";

// Function async validation token
async function checkAccessToken(token: string | undefined) {
  const accessSecretKey = new TextEncoder().encode(
    process.env.JWT_ACCESS_SECRET,
  );
  if (!token) return false;
  try {
    await jwtVerify(token, accessSecretKey);
    return true;
  } catch {
    return false;
  }
}

// Function get refresh token
async function getRefreshTokens(
  refreshToken: string,
): Promise<TokenPair | null> {
  const refreshTokenJson = { refresh_token: refreshToken };
  const res = await backendFetch<TokenPair & { error?: string }>(
    "/icda/v1/user/refresh",
    { method: "POST", body: refreshTokenJson },
  );
  if (!res.ok || res.status == 0) return null;
  return res.data;
}

// Middleware
export async function middleware(req: NextRequest) {
  // next if url or domain not in scope protected
  const { pathname } = req.nextUrl;
  const isProtected = ["/private"].some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // next if access token valid
  const accessToken = req.cookies.get("access_token")?.value;
  if (await checkAccessToken(accessToken)) return NextResponse.next();

  // Process refresh token
  const refreshToken = req.cookies.get("refresh_token")?.value;
  if (refreshToken) {
    const tokens = await getRefreshTokens(refreshToken);
    if (tokens) {
      // Updete header cookie token for first trigger
      const newAccessToken = `access_token=${tokens.access_token}`;
      const newRefreshToken = `refresh_token=${tokens.refresh_token}`;
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("cookie", `${newAccessToken}; ${newRefreshToken}`);
      const res = NextResponse.next({ request: { headers: requestHeaders } });

      // Updete header cookie token for next trigger
      res.cookies.set("access_token", tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: tokens.expires_in,
      });
      res.cookies.set("refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }
  }

  // Redirect to login page
  return NextResponse.redirect(new URL("/global/login", req.url));
}

// Middleware hanya berjalan pada folder private
export const config = {
  matcher: ["/private/:path*"],
};
