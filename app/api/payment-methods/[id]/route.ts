import { NextRequest, NextResponse } from "next/server";
import { paymentMethodQueries } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const existingMethod = paymentMethodQueries.getById().get(id) as { name: string } | undefined;
    if (!existingMethod) {
      return NextResponse.json({ error: "Método de pago no encontrado" }, { status: 404 });
    }

    paymentMethodQueries.update().run(
      body.name,
      body.icon,
      body.color,
      id
    );
    
    const updatedMethod = paymentMethodQueries.getById().get(id);
    return NextResponse.json(updatedMethod);
  } catch (error) {
    console.error("Error al actualizar método de pago:", error);
    return NextResponse.json({ error: "Error al actualizar método de pago" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existingMethod = paymentMethodQueries.getById().get(id) as { name: string } | undefined;
    if (!existingMethod) {
      return NextResponse.json({ error: "Método de pago no encontrado" }, { status: 404 });
    }

    const usage = paymentMethodQueries.checkUsage().get(existingMethod.name) as { count: number };
    
    if (usage.count > 0) {
      return NextResponse.json(
        { error: `No se puede eliminar: tiene ${usage.count} gasto(s) asociado(s)` },
        { status: 400 }
      );
    }

    paymentMethodQueries.delete().run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar método de pago:", error);
    return NextResponse.json({ error: "Error al eliminar método de pago" }, { status: 500 });
  }
}
