import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const MODELS_DIR = path.join(process.cwd(), "content", "models");

export async function GET() {
  try {
    const files = await fs.readdir(MODELS_DIR);
    const models = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (file) => {
          const content = await fs.readFile(
            path.join(MODELS_DIR, file),
            "utf-8"
          );
          return JSON.parse(content);
        })
    );
    return NextResponse.json(models);
  } catch {
    return NextResponse.json(
      { error: "Failed to load models" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newModel = await req.json();

    if (!newModel.id || !newModel.name?.en) {
      return NextResponse.json(
        { error: "Missing required fields: id, name.en" },
        { status: 400 }
      );
    }

    // Sanitize ID
    const safeId = newModel.id.replace(/[^a-z0-9-]/gi, "").toLowerCase();
    if (!safeId) {
      return NextResponse.json({ error: "Invalid model ID" }, { status: 400 });
    }
    newModel.id = safeId;

    // Check if model already exists
    const filePath = path.join(MODELS_DIR, `${safeId}.json`);
    try {
      await fs.access(filePath);
      return NextResponse.json(
        { error: "A model with this ID already exists" },
        { status: 409 }
      );
    } catch {
      // File doesn't exist — good
    }

    // Force safe defaults
    newModel.isAvailable = false;
    newModel.currency = newModel.currency || "USD";

    await fs.writeFile(filePath, JSON.stringify(newModel, null, 2), "utf-8");

    // Create image directory for the model
    const imgDir = path.join(process.cwd(), "public", "images", "models", safeId);
    await fs.mkdir(imgDir, { recursive: true });

    return NextResponse.json(newModel, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create model" },
      { status: 500 }
    );
  }
}
