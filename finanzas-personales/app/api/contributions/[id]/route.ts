import { NextRequest, NextResponse } from "next/server";
import { contributionQueries } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    contributionQueries.delete.run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar aporte" }, { status: 500 });
  }
}
