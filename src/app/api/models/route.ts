import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createModel, getAllModels } from "@/lib/models";

export async function GET() {
  try {
    const models = await getAllModels();
    return NextResponse.json(models);
  } catch {
    return NextResponse.json(
      { error: "Failed to load products" },
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

    const safeId = newModel.id.replace(/[^a-z0-9-]/gi, "").toLowerCase();
    if (!safeId) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const savedModel = await createModel({ ...newModel, id: safeId });
    return NextResponse.json(savedModel, { status: 201 });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "A product with this ID already exists"
    ) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
