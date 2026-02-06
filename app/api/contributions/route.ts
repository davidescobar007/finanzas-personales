import { NextRequest, NextResponse } from "next/server";
import { contributionQueries, fundQueries, Fund } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month");

    let contributions;
    if (month) {
      contributions = contributionQueries.getByMonth.all(month);
    } else {
      contributions = contributionQueries.getAll.all();
    }

    const contributionsWithFund = contributions.map((c: any) => {
      const fund = fundQueries.getById.get(c.fundId) as Fund | undefined;
      return {
        ...c,
        fundName: fund?.name,
        fundIcon: fund?.icon,
        fundColor: fund?.color,
      };
    });

    return NextResponse.json(contributionsWithFund);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener aportes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contributionQueries.create.run(
      body.fundId,
      body.amount,
      body.date,
      body.notes || ""
    );

    const contribution = contributionQueries.getById.get(result.lastInsertRowid);
    const fund = fundQueries.getById.get(body.fundId) as Fund | undefined;

    return NextResponse.json({
      ...(contribution || {}),
      fundName: fund?.name,
      fundIcon: fund?.icon,
      fundColor: fund?.color,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating contribution:", error);
    return NextResponse.json({ error: "Error al crear aporte" }, { status: 500 });
  }
}
