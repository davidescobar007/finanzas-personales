import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { ArrowUp, ArrowDown, Minus, TrendingUp, BarChart3, Calendar, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface KPIS {
  totalExpenses: number;
  totalSavings: number;
  totalInvestments: number;
  totalToTransfer: number;
}

interface MonthlyComparisonProps {
  currentMonth: string;
  currentKPIs: KPIS;
  previousKPIs?: KPIS;
}

const MonthlyComparison = ({
  currentMonth,
  currentKPIs,
  previousKPIs,
}: MonthlyComparisonProps) => {
  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    return date.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });
  };

  const calculateDifference = (current: number, previous: number) => {
    if (previous === undefined || previous === 0) return { diff: 0, percent: 0 };
    const diff = current - previous;
    const percent = ((diff / Math.abs(previous)) * 100);
    return { diff, percent };
  };

  const renderChange = (
    current: number,
    previous: number | undefined,
    isPositiveGood: boolean
  ) => {
    if (previous === undefined) {
      return <span className="text-gray-400 text-sm">Sin datos previos</span>;
    }

    const { diff, percent } = calculateDifference(current, previous);
    const isImprovement = isPositiveGood ? diff <= 0 : diff >= 0;

    return (
      <div className={`flex items-center gap-2 ${isImprovement ? "text-white" : "text-white"}`}>
        {diff === 0 ? (
          <Minus className="h-4 w-4" />
        ) : isImprovement ? (
          <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUp className="h-4 w-4" />
        )}
        <span className="font-bold text-sm">
          {isImprovement ? "-" : "+"}
          {formatCurrency(Math.abs(diff))}
        </span>
        <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full font-medium">
          {isImprovement ? "-" : "+"}{percent.toFixed(1)}%
        </span>
      </div>
    );
  };

  const kpiData = [
    {
      label: "Gastos",
      current: currentKPIs.totalExpenses,
      previous: previousKPIs?.totalExpenses,
      isPositiveGood: false,
      color: "from-rose-500 via-red-500 to-orange-500",
      bgColor: "bg-rose-50",
      icon: <ArrowUp className="h-5 w-5" />,
    },
    {
      label: "Ahorros",
      current: currentKPIs.totalSavings,
      previous: previousKPIs?.totalSavings,
      isPositiveGood: true,
      color: "from-emerald-500 via-green-500 to-teal-500",
      bgColor: "bg-emerald-50",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      label: "Inversiones",
      current: currentKPIs.totalInvestments,
      previous: previousKPIs?.totalInvestments,
      isPositiveGood: true,
      color: "from-blue-500 via-indigo-500 to-violet-500",
      bgColor: "bg-blue-50",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      label: "Transferencias",
      current: currentKPIs.totalToTransfer,
      previous: previousKPIs?.totalToTransfer,
      isPositiveGood: false,
      color: "from-purple-500 via-pink-500 to-rose-500",
      bgColor: "bg-purple-50",
      icon: <Sparkles className="h-5 w-5" />,
    },
  ];

  return (
    <Card className="mb-8 border-2 border-gray-100 hover:border-indigo-200 transition-all duration-300 shadow-sm hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Comparativa Mensual
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
          <p className="text-sm text-gray-600">
            Comparativa:{" "}
            <span className="font-semibold text-gray-900 bg-white px-2 py-0.5 rounded-md">
              {formatMonth(currentMonth)}
            </span>{" "}
            vs{" "}
            {previousKPIs ? (
              <span className="font-semibold text-gray-900 bg-white px-2 py-0.5 rounded-md">
                {formatMonth(currentMonth.slice(0, 5) + (parseInt(currentMonth.slice(5, 7)) - 1).toString().padStart(2, "0"))}
              </span>
            ) : (
              <span className="text-gray-400">Sin mes anterior</span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <div
              key={kpi.label}
              className={`rounded-2xl p-5 bg-gradient-to-br ${kpi.color} text-white relative overflow-hidden group hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-${kpi.bgColor.split('-')[1]}-500/20`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '500ms' }} />
              <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                    {kpi.icon}
                  </div>
                  <p className="text-sm font-semibold opacity-90">{kpi.label}</p>
                </div>
                
                <p className="text-3xl font-bold mb-4 group-hover:scale-105 transition-transform duration-300">
                  {formatCurrency(kpi.current)}
                </p>
                
                <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm group-hover:bg-white/25 transition-all duration-300">
                  {renderChange(kpi.current, kpi.previous, kpi.isPositiveGood)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { MonthlyComparison };
