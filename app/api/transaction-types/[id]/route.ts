import { NextResponse } from "next/server";
import { transactionTypeQueries } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transactionType = transactionTypeQueries.getById.get(parseInt(id));
    if (!transactionType) {
      return NextResponse.json({ error: "Transaction type not found" }, { status: 404 });
    }
    return NextResponse.json(transactionType);
  } catch (error) {
    console.error("Error fetching transaction type:", error);
    return NextResponse.json({ error: "Error fetching transaction type" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, icon, color, classification } = await request.json();

    if (!name || !icon || !color) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = transactionTypeQueries.update.run(name, icon, color, classification || 'expense', parseInt(id));
    if (result.changes === 0) {
      return NextResponse.json({ error: "Transaction type not found" }, { status: 404 });
    }

    const transactionType = transactionTypeQueries.getById.get(parseInt(id));
    return NextResponse.json(transactionType);
  } catch (error: any) {
    console.error("Error updating transaction type:", error);
    if (error.code === "SQLITE_CONSTRAINT") {
      return NextResponse.json({ error: "Transaction type already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Error updating transaction type" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const usageCheck = transactionTypeQueries.checkUsage.get(id) as { count: number };
    if (usageCheck.count > 0) {
      return NextResponse.json(
        { error: "Cannot delete transaction type with existing transactions" },
        { status: 400 }
      );
    }

    const result = transactionTypeQueries.delete.run(parseInt(id));
    if (result.changes === 0) {
      return NextResponse.json({ error: "Transaction type not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transaction type deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction type:", error);
    return NextResponse.json({ error: "Error deleting transaction type" }, { status: 500 });
  }
}
