import { NextResponse } from "next/server";
import { transactionTypeQueries } from "@/lib/db";

export async function GET() {
  try {
    const transactionTypes = transactionTypeQueries.getAll().all();
    return NextResponse.json(transactionTypes);
  } catch (error) {
    console.error("Error fetching transaction types:", error);
    return NextResponse.json({ error: "Error fetching transaction types" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, icon, color, classification } = await request.json();

    if (!name || !icon || !color) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = transactionTypeQueries.create().run(name, icon, color, classification || 'expense');
    const transactionType = transactionTypeQueries.getById().get(result.lastInsertRowid as number);

    return NextResponse.json(transactionType, { status: 201 });
  } catch (error: any) {
    console.error("Error creating transaction type:", error);
    if (error.code === "SQLITE_CONSTRAINT") {
      return NextResponse.json({ error: "Transaction type already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Error creating transaction type" }, { status: 500 });
  }
}
