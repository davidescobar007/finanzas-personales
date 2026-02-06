import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { TrendingDown, Wallet, Calendar, PiggyBank, TrendingUp, ArrowUpDown, ArrowUp, ArrowDown, Minus } from "lucide-react";

interface KPIS {
  totalExpenses: number;
  totalSavings: number;
  totalInvestments: number;
  totalToTransfer: number;
}

interface TransactionType {
  id: number;
  name: string;
  icon: string;
  color: string;
  classification: 'expense' | 'savings' | 'investment' | 'transfer';
}

interface SummaryCardsProps {
  kpis: KPIS;
  previousKpis?: KPIS;
  transactionTypes?: TransactionType[];
}

const SummaryCards = ({ kpis, previousKpis, transactionTypes = [] }: SummaryCardsProps) => {
  const calculateDifference = (current: number, previous?: number) => {
    if (previous === undefined || previous === 0) return { diff: 0, percent: 0 };
    const diff = current - previous;
    const percent = ((diff / Math.abs(previous)) * 100);
    return { diff, percent };
  };

  const renderChange = (
    current: number,
    isPositiveGood: boolean,
    previous?: number
  ) => {
    if (previous === undefined) return null;

    const { diff, percent } = calculateDifference(current, previous);
    const isImprovement = isPositiveGood ? diff <= 0 : diff >= 0;

    return (
      <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
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
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
            {isImprovement ? "-" : "+"}{percent.toFixed(1)}%
          </span>
        </div>
        <p className="text-xs opacity-80 mt-1">vs mes anterior</p>
      </div>
    );
  };

  const classificationConfig = {
    expense: {
      title: "Gastos del mes",
      value: kpis.totalExpenses,
      previous: previousKpis?.totalExpenses,
      isPositiveGood: false,
      icon: <TrendingDown className="h-5 w-5" />,
      color: "from-rose-500 via-red-500 to-orange-500",
      bgColor: "bg-rose-50",
    },
    savings: {
      title: "Ahorros",
      value: kpis.totalSavings,
      previous: previousKpis?.totalSavings,
      isPositiveGood: true,
      icon: <PiggyBank className="h-5 w-5" />,
      color: "from-emerald-500 via-green-500 to-teal-500",
      bgColor: "bg-emerald-50",
    },
    investment: {
      title: "Inversiones",
      value: kpis.totalInvestments,
      previous: previousKpis?.totalInvestments,
      isPositiveGood: true,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "from-blue-500 via-indigo-500 to-violet-500",
      bgColor: "bg-blue-50",
    },
    transfer: {
      title: "Transferencias",
      value: kpis.totalToTransfer,
      previous: previousKpis?.totalToTransfer,
      isPositiveGood: false,
      icon: <ArrowUpDown className="h-5 w-5" />,
      color: "from-purple-500 via-pink-500 to-rose-500",
      bgColor: "bg-purple-50",
    },
  };

  const stats = Object.entries(classificationConfig)
    .filter(([key, config]: [string, any]) => {
      if (config.value > 0) return true;
      const classification = key;
      const hasTypes = transactionTypes.some((t: TransactionType) => t.classification === classification);
      return hasTypes;
    })
    .map(([key, config]: [string, any]) => config);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          <p>No hay datos para mostrar este mes</p>
        </div>
      ) : (
        stats.map((stat: any, index) => {
          return (
            <Card
              key={index}
              className="group border-0 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <CardContent className="p-0">
                <div className={`bg-gradient-to-br ${stat.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '500ms' }} />
                  <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-all duration-300">
                        {stat.icon}
                      </div>
                    </div>

                    <p className="text-xs font-semibold opacity-90 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold mb-3 group-hover:scale-105 transition-transform duration-300">
                      {formatCurrency(stat.value)}
                    </p>

                    {renderChange(stat.value, stat.isPositiveGood, stat.previous)}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export { SummaryCards };
