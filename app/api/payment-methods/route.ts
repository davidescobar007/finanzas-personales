import { NextRequest, NextResponse } from "next/server";
import { paymentMethodQueries } from "@/lib/db";

export async function GET() {
  try {
    const methods = paymentMethodQueries.getAll().all();
    return NextResponse.json(methods);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener métodos de pago" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.icon || !body.color) {
      return NextResponse.json(
        { error: "Nombre, icono y color son requeridos" },
        { status: 400 }
      );
    }

    const existingMethods = paymentMethodQueries.getAll().all() as { name: string }[];
    const nameExists = existingMethods.some((m) => m.name.toLowerCase() === body.name.toLowerCase());
    
    if (nameExists) {
      return NextResponse.json(
        { error: "Ya existe un método de pago con ese nombre" },
        { status: 409 }
      );
    }

    const result = paymentMethodQueries.create().run(body.name, body.icon, body.color);
    const newMethod = paymentMethodQueries.getById().get(result.lastInsertRowid);
    
    return NextResponse.json(newMethod, { status: 201 });
  } catch (error) {
    console.error("Error al crear método de pago:", error);
    return NextResponse.json({ error: "Error al crear método de pago" }, { status: 500 });
  }
}
