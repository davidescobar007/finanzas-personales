import { NextResponse } from "next/server";
import { categoryQueries, Category } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, icon, color } = await request.json();

    if (!name || !icon || !color) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = categoryQueries.update().run(name, icon, color, id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const category = categoryQueries.getById().get(Number(id));
    return NextResponse.json(category);
  } catch (error: any) {
    console.error("Error updating category:", error);
    if (error.code === "SQLITE_CONSTRAINT") {
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Error updating category" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const category = categoryQueries.getById().get(Number(id)) as Category | undefined;
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const usage = categoryQueries.checkUsage().get(category.name) as { count: number };
    if (usage.count > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing expenses" },
        { status: 400 }
      );
    }

    const result = categoryQueries.delete().run(Number(id));

    if (result.changes === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Error deleting category" }, { status: 500 });
  }
}
