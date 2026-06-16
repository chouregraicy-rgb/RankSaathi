// src/app/api/imgproxy/route.ts
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "jrdpxdalwvmcffmfqajk.supabase.co",
  "upload.wikimedia.org",
  "commons.wikimedia.org",
];

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  const allowed = ALLOWED_HOSTS.some(
    (h) => parsed.hostname === h || parsed.hostname.endsWith("." + h)
  );
  if (!allowed) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "VidyaSaathi/1.0 (https://vidhyasaathi.online; contact@globalwebsaas.org)",
        "Accept": "image/*,*/*",
        "Referer": "https://en.wikipedia.org/",
      },
      next: { revalidate: 86400 }, // cache 24 hours
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Upstream ${res.status}` }, { status: 502 });
    }

    const contentType = res.headers.get("content-type") ?? "image/png";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("imgproxy error:", err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 502 });
  }
}