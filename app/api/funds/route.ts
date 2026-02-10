import { NextRequest, NextResponse } from "next/server";
import { fundQueries, contributionQueries } from "@/lib/db";

export async function GET() {
  try {
    const funds = fundQueries.getAll().all();
    const fundsWithProgress = funds.map((fund: any) => {
      const totalContributions = contributionQueries.getTotalByFund().get(fund.id) as { total: number } | undefined;
      const total = totalContributions?.total || 0;
      return {
        ...fund,
        currentAmount: total,
        progress: fund.targetAmount > 0 ? Math.min((total / fund.targetAmount) * 100, 100) : 0,
      };
    });
    return NextResponse.json(fundsWithProgress);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener fondos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = fundQueries.create().run(
      body.name,
      body.targetAmount,
      0,
      body.icon,
      body.color,
      body.deadline || null
    );
    const fund = fundQueries.getById().get(result.lastInsertRowid);
    return NextResponse.json({ ...(fund || {}), progress: 0 }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear fondo" }, { status: 500 });
  }
}
