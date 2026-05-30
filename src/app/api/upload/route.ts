import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const type = formData.get("type") as string | null;
  const modelId = formData.get("modelId") as string | null;

  if (!file || !type || !modelId) {
    return NextResponse.json(
      { error: "Missing required fields: file, type, modelId" },
      { status: 400 }
    );
  }

  // Sanitize modelId to prevent path traversal
  const safeId = modelId.replace(/[^a-z0-9-]/gi, "");
  if (!safeId) {
    return NextResponse.json({ error: "Invalid model ID" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let destPath: string;
  let publicPath: string;

  if (type === "hero") {
    const ext = path.extname(file.name) || ".jpg";
    destPath = path.join(process.cwd(), "public", "images", "models", safeId, `hero${ext}`);
    publicPath = `/images/models/${safeId}/hero${ext}`;
  } else if (type === "silhouette") {
    destPath = path.join(process.cwd(), "public", "images", "ModelColors", `${safeId}.png`);
    publicPath = `/images/ModelColors/${safeId}.png`;
  } else if (type === "heroVideo") {
    destPath = path.join(process.cwd(), "public", "images", "models", safeId, "hero.mp4");
    publicPath = `/images/models/${safeId}/hero.mp4`;
  } else {
    return NextResponse.json({ error: "Invalid type. Use: hero, silhouette, heroVideo" }, { status: 400 });
  }

  await fs.mkdir(path.dirname(destPath), { recursive: true });
  await fs.writeFile(destPath, buffer);

  return NextResponse.json({ path: publicPath });
}
