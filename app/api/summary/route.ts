import { NextRequest, NextResponse } from "next/server";
import { expenseQueries, categoryQueries, paymentMethodQueries, transactionTypeQueries } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month") || new Date().toISOString().slice(0, 7);
    const previousMonth = searchParams.get("previousMonth");

    const expenses = expenseQueries.getByMonth().all(month);
    const allExpenses = expenseQueries.getAll().all();
    const transactionTypes = transactionTypeQueries.getAll().all();

    const expenseTypes = transactionTypes
      .filter((t: any) => t.classification === 'expense')
      .map((t: any) => t.name);

    const savingsTypes = transactionTypes
      .filter((t: any) => t.classification === 'savings')
      .map((t: any) => t.name);

    const investmentTypes = transactionTypes
      .filter((t: any) => t.classification === 'investment')
      .map((t: any) => t.name);

    const transferTypes = transactionTypes
      .filter((t: any) => t.classification === 'transfer')
      .map((t: any) => t.name);

    const kpis = {
      totalExpenses: expenses
        .filter((e: any) => expenseTypes.includes(e.type))
        .reduce((sum: number, e: any) => sum + e.amount, 0),
      totalSavings: expenses
        .filter((e: any) => savingsTypes.includes(e.type))
        .reduce((sum: number, e: any) => sum + e.amount, 0),
      totalInvestments: expenses
        .filter((e: any) => investmentTypes.includes(e.type))
        .reduce((sum: number, e: any) => sum + e.amount, 0),
      totalToTransfer: expenses
        .filter((e: any) => transferTypes.includes(e.type))
        .reduce((sum: number, e: any) => sum + e.amount, 0),
      count: allExpenses.length,
    };

    const summary = expenseQueries.getSummary().all(month);
    const paymentSummary = expenseQueries.getByPaymentMethod().all(month);
    const typeSummary = expenseQueries.getTypeSummary().all(month);

    const categories = categoryQueries.getAll().all();
    const paymentMethods = paymentMethodQueries.getAll().all();

    const previousKpis = previousMonth ? {
      totalExpenses: expenseQueries.getByMonth().all(previousMonth)
        .filter((e: any) => expenseTypes.includes(e.type))
        .reduce((sum: number, e: any) => sum + e.amount, 0),
      totalSavings: expenseQueries.getByMonth().all(previousMonth)
        .filter((e: any) => savingsTypes.includes(e.type))
        .reduce((sum: number, e: any) => sum + e.amount, 0),
      totalInvestments: expenseQueries.getByMonth().all(previousMonth)
        .filter((e: any) => investmentTypes.includes(e.type))
        .reduce((sum: number, e: any) => sum + e.amount, 0),
      totalToTransfer: expenseQueries.getByMonth().all(previousMonth)
        .filter((e: any) => transferTypes.includes(e.type))
        .reduce((sum: number, e: any) => sum + e.amount, 0),
    } : undefined;

    const getMonthlyTrend = () => {
      const trend: { month: string; expenses: number; savings: number; investments: number }[] = [];
      const currentDate = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthKey = d.toISOString().slice(0, 7);
        const monthlyExpenses = expenseQueries.getByMonth().all(monthKey);
        
        trend.push({
          month: monthKey,
          expenses: monthlyExpenses.filter((e: any) => e.type === "Gasto").reduce((sum: number, e: any) => sum + e.amount, 0),
          savings: monthlyExpenses.filter((e: any) => e.type === "Ahorro").reduce((sum: number, e: any) => sum + e.amount, 0),
          investments: monthlyExpenses.filter((e: any) => e.type === "Inversión").reduce((sum: number, e: any) => sum + e.amount, 0),
        });
      }
      
      return trend;
    };

    const monthlyTrend = getMonthlyTrend();

    return NextResponse.json({
      kpis,
      summary,
      paymentSummary,
      typeSummary,
      previousKpis,
      categories: categories || [],
      paymentMethods: paymentMethods || [],
      transactionTypes: transactionTypes || [],
    });
  } catch (error) {
    console.error("Error en /api/summary:", error);
    return NextResponse.json({
      kpis: {
        totalExpenses: 0,
        totalSavings: 0,
        totalInvestments: 0,
        totalToTransfer: 0,
        count: 0,
      },
      summary: [],
      paymentSummary: [],
      typeSummary: [],
      previousKpis: undefined,
      categories: [],
      paymentMethods: [],
      monthlyTrend: [],
    }, { status: 500 });
  }
}
