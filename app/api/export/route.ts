import { NextResponse } from "next/server";
import { expenseQueries, categoryQueries, paymentMethodQueries, fundQueries, contributionQueries, transactionTypeQueries } from "@/lib/db";

export async function GET() {
  try {
    const expenses = expenseQueries.getAll.all();
    const categories = categoryQueries.getAll.all();
    const paymentMethods = paymentMethodQueries.getAll.all();
    const funds = fundQueries.getAll.all();
    const contributions = contributionQueries.getAll.all();
    const transactionTypes = transactionTypeQueries.getAll.all();

    const data = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      data: {
        expenses,
        categories,
        paymentMethods,
        funds,
        contributions,
        transactionTypes,
      },
    };

    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="finanzas-backup-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("Error exporting data:", error);
    return NextResponse.json({ error: "Error al exportar datos" }, { status: 500 });
  }
}
