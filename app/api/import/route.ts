import { NextRequest, NextResponse } from "next/server";
import { Database } from "better-sqlite3";
import path from "path";

interface ExportData {
  version: string;
  exportDate: string;
  data: {
    expenses: any[];
    categories: any[];
    paymentMethods: any[];
    funds: any[];
    contributions: any[];
    transactionTypes: any[];
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const mode = formData.get("mode") as string || "append"; // "replace" or "append"

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    const text = await file.text();
    const importData: ExportData = JSON.parse(text);

    if (!importData.data || !importData.version) {
      return NextResponse.json({ error: "Formato de archivo inválido" }, { status: 400 });
    }

    const dbPath = path.join("/app/data", "finanzas.db");
    const db = new Database(dbPath);
    db.pragma("journal_mode = WAL");

    const results = {
      imported: { expenses: 0, categories: 0, paymentMethods: 0, funds: 0, contributions: 0, transactionTypes: 0 },
      skipped: { expenses: 0, categories: 0, paymentMethods: 0, funds: 0, contributions: 0, transactionTypes: 0 },
      errors: [] as string[],
    };

    try {
      db.exec("BEGIN TRANSACTION");

      if (mode === "replace") {
        db.exec("DELETE FROM contributions");
        db.exec("DELETE FROM funds");
        db.exec("DELETE FROM expenses");
        db.exec("DELETE FROM categories");
        db.exec("DELETE FROM paymentMethods");
        db.exec("DELETE FROM transactionTypes");
      }

      const insertExpense = db.prepare(`
        INSERT INTO expenses (title, amount, category, date, notes, paymentMethod, type, fundId, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const insertCategory = db.prepare("INSERT INTO categories (name, icon, color) VALUES (?, ?, ?)");
      const insertPaymentMethod = db.prepare("INSERT INTO paymentMethods (name, icon, color) VALUES (?, ?, ?)");
      const insertFund = db.prepare("INSERT INTO funds (name, targetAmount, currentAmount, icon, color, deadline, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)");
      const insertContribution = db.prepare("INSERT INTO contributions (fundId, amount, date, notes, createdAt) VALUES (?, ?, ?, ?, ?)");
      const insertTransactionType = db.prepare("INSERT INTO transactionTypes (name, icon, color, classification) VALUES (?, ?, ?, ?)");

      const checkCategory = db.prepare("SELECT id FROM categories WHERE name = ?");
      const checkPaymentMethod = db.prepare("SELECT id FROM paymentMethods WHERE name = ?");
      const checkTransactionType = db.prepare("SELECT id FROM transactionTypes WHERE name = ?");
      const checkFund = db.prepare("SELECT id FROM funds WHERE name = ?");

      const categoryMap = new Map<number, number>();
      const paymentMethodMap = new Map<number, number>();
      const transactionTypeMap = new Map<number, number>();
      const fundMap = new Map<number, number>();

      for (const category of importData.data.categories) {
        try {
          const existing = checkCategory.get(category.name);
          if (existing && mode === "append") {
            categoryMap.set(category.id, existing.id);
            results.skipped.categories++;
            continue;
          }

          const result = insertCategory.run(category.name, category.icon, category.color);
          const newId = Number(result.lastInsertRowid);
          categoryMap.set(category.id, newId);
          results.imported.categories++;
        } catch (error) {
          results.errors.push(`Error importando categoría ${category.name}: ${error}`);
        }
      }

      for (const paymentMethod of importData.data.paymentMethods) {
        try {
          const existing = checkPaymentMethod.get(paymentMethod.name);
          if (existing && mode === "append") {
            paymentMethodMap.set(paymentMethod.id, existing.id);
            results.skipped.paymentMethods++;
            continue;
          }

          const result = insertPaymentMethod.run(paymentMethod.name, paymentMethod.icon, paymentMethod.color);
          const newId = Number(result.lastInsertRowid);
          paymentMethodMap.set(paymentMethod.id, newId);
          results.imported.paymentMethods++;
        } catch (error) {
          results.errors.push(`Error importando método de pago ${paymentMethod.name}: ${error}`);
        }
      }

      for (const transactionType of importData.data.transactionTypes) {
        try {
          const existing = checkTransactionType.get(transactionType.name);
          if (existing && mode === "append") {
            transactionTypeMap.set(transactionType.id, existing.id);
            results.skipped.transactionTypes++;
            continue;
          }

          const result = insertTransactionType.run(
            transactionType.name,
            transactionType.icon,
            transactionType.color,
            transactionType.classification || "expense"
          );
          const newId = Number(result.lastInsertRowid);
          transactionTypeMap.set(transactionType.id, newId);
          results.imported.transactionTypes++;
        } catch (error) {
          results.errors.push(`Error importando tipo de transacción ${transactionType.name}: ${error}`);
        }
      }

      for (const fund of importData.data.funds) {
        try {
          const existing = checkFund.get(fund.name);
          if (existing && mode === "append") {
            fundMap.set(fund.id, existing.id);
            results.skipped.funds++;
            continue;
          }

          const result = insertFund.run(
            fund.name,
            fund.targetAmount,
            fund.currentAmount,
            fund.icon,
            fund.color,
            fund.deadline || null,
            fund.createdAt || new Date().toISOString()
          );
          const newId = Number(result.lastInsertRowid);
          fundMap.set(fund.id, newId);
          results.imported.funds++;
        } catch (error) {
          results.errors.push(`Error importando fondo ${fund.name}: ${error}`);
        }
      }

      for (const expense of importData.data.expenses) {
        try {
          const fundId = expense.fundId ? fundMap.get(expense.fundId) : null;
          
          insertExpense.run(
            expense.title,
            expense.amount,
            expense.category,
            expense.date,
            expense.notes || null,
            expense.paymentMethod,
            expense.type || "Gasto",
            fundId,
            expense.createdAt || new Date().toISOString()
          );
          results.imported.expenses++;
        } catch (error) {
          results.errors.push(`Error importando gasto "${expense.title}": ${error}`);
        }
      }

      for (const contribution of importData.data.contributions) {
        try {
          const fundId = fundMap.get(contribution.fundId);
          if (!fundId) {
            results.errors.push(`Error: Fondo ID ${contribution.fundId} no encontrado para contribución`);
            results.skipped.contributions++;
            continue;
          }

          insertContribution.run(
            fundId,
            contribution.amount,
            contribution.date,
            contribution.notes || null,
            contribution.createdAt || new Date().toISOString()
          );
          results.imported.contributions++;
        } catch (error) {
          results.errors.push(`Error importando contribución: ${error}`);
        }
      }

      db.exec("COMMIT");

      return NextResponse.json({
        success: true,
        results,
        message: `Importación completada. ${Object.values(results.imported).reduce((a, b) => a + b, 0)} registros importados, ${Object.values(results.skipped).reduce((a, b) => a + b, 0)} omitidos, ${results.errors.length} errores`,
      });
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Error importing data:", error);
    return NextResponse.json({ error: "Error al importar datos" }, { status: 500 });
  }
}
