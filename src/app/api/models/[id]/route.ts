import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const MODELS_DIR = path.join(process.cwd(), "content", "models");

async function readModel(id: string) {
  const filePath = path.join(MODELS_DIR, `${id}.json`);
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content);
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const model = await readModel(params.id);
    return NextResponse.json(model);
  } catch {
    return NextResponse.json({ error: "Model not found" }, { status: 404 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify the model exists before overwriting
    await readModel(params.id);

    const updatedModel = await req.json();
    // Guarantee id cannot be changed via patch
    updatedModel.id = params.id;

    const filePath = path.join(MODELS_DIR, `${params.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(updatedModel, null, 2), "utf-8");

    return NextResponse.json(updatedModel);
  } catch {
    return NextResponse.json(
      { error: "Failed to update model" },
      { status: 500 }
    );
  }
}
