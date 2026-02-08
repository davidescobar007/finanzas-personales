import { NextResponse } from "next/server";
import { expenseQueries, categoryQueries, paymentMethodQueries, fundQueries, contributionQueries, transactionTypeQueries } from "@/lib/db";

function escapeCSV(value: any): string {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function convertToCSV<T extends Record<string, any>>(data: T[], headers: string[]): string {
  if (data.length === 0) return headers.join(",") + "\n";
  
  const rows = data.map(row => 
    headers.map(header => escapeCSV(row[header])).join(",")
  );
  
  return [headers.join(","), ...rows].join("\n");
}

export async function GET() {
  try {
    const expenses = expenseQueries.getAll.all();
    const categories = categoryQueries.getAll.all();
    const paymentMethods = paymentMethodQueries.getAll.all();
    const funds = fundQueries.getAll.all();
    const contributions = contributionQueries.getAll.all();
    const transactionTypes = transactionTypeQueries.getAll.all();

    const expensesCSV = convertToCSV(expenses, [
      "id", "title", "amount", "category", "date", "notes", 
      "paymentMethod", "type", "fundId", "createdAt"
    ]);

    const categoriesCSV = convertToCSV(categories, [
      "id", "name", "icon", "color"
    ]);

    const paymentMethodsCSV = convertToCSV(paymentMethods, [
      "id", "name", "icon", "color"
    ]);

    const fundsCSV = convertToCSV(funds, [
      "id", "name", "targetAmount", "currentAmount", "icon", 
      "color", "deadline", "createdAt"
    ]);

    const contributionsCSV = convertToCSV(contributions, [
      "id", "fundId", "amount", "date", "notes", "createdAt"
    ]);

    const transactionTypesCSV = convertToCSV(transactionTypes, [
      "id", "name", "icon", "color", "classification"
    ]);

    const combinedCSV = `=== EXPENSOS ===
${expensesCSV}

=== CATEGORIAS ===
${categoriesCSV}

=== METODOS_DE_PAGO ===
${paymentMethodsCSV}

=== FONDOS ===
${fundsCSV}

=== CONTRIBUCIONES ===
${contributionsCSV}

=== TIPOS_DE_TRANSACCION ===
${transactionTypesCSV}
`;

    const date = new Date().toISOString().split('T')[0];
    return new NextResponse(combinedCSV, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="finanzas-backup-${date}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting data:", error);
    return NextResponse.json({ error: "Error al exportar datos" }, { status: 500 });
  }
}
