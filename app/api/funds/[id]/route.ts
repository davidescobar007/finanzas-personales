import { NextRequest, NextResponse } from "next/server";
import { fundQueries } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    fundQueries.update().run(
      body.name,
      body.targetAmount,
      body.icon,
      body.color,
      body.deadline || null,
      id
    );
    const fund = fundQueries.getById().get(id);
    return NextResponse.json(fund);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar fondo" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("DELETE /api/funds/", id);

    const fund = fundQueries.getById().get(id);
    if (!fund) {
      console.log("Fondo no encontrado:", id);
      return NextResponse.json({ error: "Fondo no encontrado" }, { status: 404 });
    }

    fundQueries.delete().run(id);
    console.log("Fondo eliminado correctamente, ID:", id);

    const remainingFunds = fundQueries.getAll().all();
    console.log("Fondos restantes en DB:", remainingFunds.length);

    return NextResponse.json({ success: true, remainingCount: remainingFunds.length });
  } catch (error) {
    console.error("Error en DELETE /api/funds/", error);
    return NextResponse.json({ error: "Error al eliminar fondo" }, { status: 500 });
  }
}
