import { NextRequest, NextResponse } from "next/server";
import { expenseQueries } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    expenseQueries.update().run(
      body.title,
      body.amount,
      body.category,
      body.date,
      body.notes || "",
      body.paymentMethod || "Efectivo",
      body.type || "Gasto",
      body.fundId || null,
      id
    );
    const expense = expenseQueries.getById().get(id);
    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar gasto" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    expenseQueries.delete().run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar gasto" }, { status: 500 });
  }
}
