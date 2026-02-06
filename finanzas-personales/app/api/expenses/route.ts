import { NextRequest, NextResponse } from "next/server";
import { expenseQueries } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month");
    const type = searchParams.get("type");
    const fundId = searchParams.get("fundId");

    let expenses;
    if (month) {
      expenses = expenseQueries.getByMonth.all(month);
      if (type) {
        expenses = expenses.filter((e: any) => e.type === type);
      }
      if (fundId) {
        expenses = expenses.filter((e: any) => e.fundId === parseInt(fundId));
      }
    } else {
      expenses = expenseQueries.getAll.all();
    }

    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener gastos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = expenseQueries.create.run(
      body.title,
      body.amount,
      body.category,
      body.date,
      body.notes || "",
      body.paymentMethod || "Efectivo",
      body.type || "Gasto",
      body.fundId || undefined
    );
    const expense = expenseQueries.getById.get(result.lastInsertRowid);
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear gasto" }, { status: 500 });
  }
}
