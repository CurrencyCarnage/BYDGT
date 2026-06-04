import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getCloudflareEnv } from "@/lib/cloudflare-env";

const PUBLIC_DIR = path.join(process.cwd(), "public");

function safeKey(parts: string[]) {
  const key = parts.join("/");
  if (!key || key.includes("..") || key.startsWith("/")) {
    return null;
  }
  return key;
}

export async function GET(
  _req: Request,
  { params }: { params: { key: string[] } }
) {
  const key = safeKey(params.key);
  if (!key) {
    return NextResponse.json({ error: "Invalid asset key" }, { status: 400 });
  }

  const { MEDIA_BUCKET } = getCloudflareEnv();
  if (MEDIA_BUCKET) {
    const object = await MEDIA_BUCKET.get(key);
    if (!object) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    return new Response(object.body, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
      },
    });
  }

  try {
    const filePath = path.join(PUBLIC_DIR, key);
    const resolved = path.resolve(filePath);
    if (!resolved.startsWith(path.resolve(PUBLIC_DIR))) {
      return NextResponse.json({ error: "Invalid asset key" }, { status: 400 });
    }

    const file = await fs.readFile(resolved);
    return new Response(file, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }
}
