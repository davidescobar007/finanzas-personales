import { NextResponse } from "next/server";
import { categoryQueries } from "@/lib/db";

export async function GET() {
  try {
    const categories = categoryQueries.getAll.all();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Error fetching categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, icon, color } = await request.json();

    if (!name || !icon || !color) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = categoryQueries.create.run(name, icon, color);
    const category = categoryQueries.getById.get(result.lastInsertRowid as number);

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error("Error creating category:", error);
    if (error.code === "SQLITE_CONSTRAINT") {
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Error creating category" }, { status: 500 });
  }
}
