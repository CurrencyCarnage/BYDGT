import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

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
