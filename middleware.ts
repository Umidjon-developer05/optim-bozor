// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "./lib/rate-limiter";

/** IP ni aniqroq olish (Vercel/Cloudflare/nginx) */
function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  const real = req.headers.get("x-real-ip");
  const cf = req.headers.get("cf-connecting-ip");
  // NextRequest.ip ba'zi hostlarda bor
  return fwd?.split(",")[0]?.trim() || real || cf || req.ip || "unknown";
}

/** Rate-limitdan chiqariladigan yo'llar */
const ALLOWLIST = [
  /^\/api\/auth(\/.*)?$/, // NextAuth (callback, session, signin...)
  /^\/sw\.js$/, // PWA service worker
  /^\/favicon\.ico$/, // favicon
  /^\/manifest\.webmanifest$/, // PWA manifest
  /^\/robots\.txt$/, // robots
  /^\/sitemap.*\.xml$/, // sitemap
  /^\/\.well-known\/.*$/, // assetlinks.json va boshqalar
];

/** Doimiy www ga kanonizatsiya (cookie host-only muammosini oldini oladi) */
function canonicalizeWWW(req: NextRequest) {
  const url = req.nextUrl.clone();
  if (url.protocol === "http:" || url.hostname === "optim-bozor.uz") {
    url.protocol = "https:";
    url.hostname = "www.optim-bozor.uz";
    return NextResponse.redirect(url, 301);
  }
  return null;
}

export function middleware(req: NextRequest) {
  // 0) OPTIONS preflight -> hech narsani to‘smaymiz
  if (req.method === "OPTIONS") return NextResponse.next();

  // 1) www kanonizatsiya
  const redirect = canonicalizeWWW(req);
  if (redirect) return redirect;

  const pathname = req.nextUrl.pathname;

  // 2) Allowlist yo‘llarni rate-limitdan chiqaramiz
  if (ALLOWLIST.some((r) => r.test(pathname))) {
    return NextResponse.next();
  }

  // 3) Rate limit
  const ip = getClientIp(req);
  if (!rateLimiter(ip)) {
    return NextResponse.json(
      { message: "Too many requests, please try again later." },
      { status: 429 }
    );
  }

  return NextResponse.next();
}

/**
 * .(static) va _next resurslarini tashlab ketamiz,
 * ildiz, sahifalar, API/TRPC yo‘llar ishlovdan o‘tadi
 */
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
