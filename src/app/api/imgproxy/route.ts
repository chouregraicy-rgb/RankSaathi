// src/app/api/imgproxy/route.ts
// Proxies Wikimedia images server-side to bypass hotlink protection
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = ["upload.wikimedia.org", "commons.wikimedia.org"];

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url param", { status: 400 });
  }

  try {
    const parsed = new URL(url);
    if (!ALLOWED_HOSTS.some(h => parsed.hostname.endsWith(h))) {
      return new NextResponse("Domain not allowed", { status: 403 });
    }

    const res = await fetch(url, {
      headers: {
        "User-Agent": "VidyaSaathi/1.0 (https://vidhyasaathi.online; contact@globalwebsaas.org) educational-platform",
        "Referer": "https://en.wikipedia.org/",
        "Accept": "image/webp,image/png,image/svg+xml,image/*,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      return new NextResponse(`Failed to fetch image: ${res.status}`, { status: 502 });
    }

    const contentType = res.headers.get("content-type") || "image/png";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    return new NextResponse(`Proxy error: ${err.message}`, { status: 500 });
  }
}
