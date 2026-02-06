import { Expense, Category, PaymentMethod } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Edit2, Trash2, ChevronDown, ChevronUp, ArrowDownRight, TrendingUp, ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface ExpenseCardV2Props {
  expense: Expense;
  category?: Category;
  paymentMethod?: PaymentMethod;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: number) => void;
}

const ExpenseCardV2 = ({
  expense,
  category,
  paymentMethod,
  onEdit,
  onDelete,
}: ExpenseCardV2Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeConfig = () => {
    switch (expense.type) {
      case "Ahorro":
        return {
          color: "text-emerald-600",
          borderColor: "border-l-emerald-500",
          bgGradient: "from-emerald-500 to-teal-500",
          icon: <TrendingUp className="h-3.5 w-3.5" />,
        };
      case "Inversión":
        return {
          color: "text-blue-600",
          borderColor: "border-l-blue-500",
          bgGradient: "from-blue-500 to-indigo-500",
          icon: <TrendingUp className="h-3.5 w-3.5" />,
        };
      case "Anticipo":
        return {
          color: "text-violet-600",
          borderColor: "border-l-violet-500",
          bgGradient: "from-violet-500 to-purple-500",
          icon: <ArrowUpDown className="h-3.5 w-3.5" />,
        };
      default:
        return {
          color: "text-rose-600",
          borderColor: "border-l-rose-500",
          bgGradient: "from-rose-500 to-orange-500",
          icon: <ArrowDownRight className="h-3.5 w-3.5" />,
        };
    }
  };

  const typeConfig = getTypeConfig();

  return (
    <div className="group bg-white rounded-2xl p-4 sm:p-5 border-2 border-gray-100 hover:border-indigo-200 shadow-lg shadow-gray-100/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/20 hover:-translate-y-0.5 border-l-4">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
          <div
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-xl shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${category?.color}15`, color: category?.color }}
          >
            {category?.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h4 className="font-bold text-gray-900 truncate text-sm sm:text-base">
                {expense.title}
              </h4>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              >
                {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>

            <p className={`text-lg sm:text-xl font-bold flex items-center justify-end gap-1.5 ${typeConfig.color} mb-2`}>
              <span className="truncate text-right">
                {formatCurrency(expense.amount)}
              </span>
            </p>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1.5">
                {typeConfig.icon}
                {expense.type || "Gasto"}
              </span>
              <span className="text-gray-300">•</span>
              <span>{paymentMethod?.name || expense.paymentMethod}</span>
              {expense.fundId && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-violet-600 font-medium">Desde fondo</span>
                </>
              )}
            </div>

            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-2 animate-in slide-in-from-top-2 duration-300">
                {expense.notes && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                      Notas:
                    </span>
                    <p className="text-sm text-gray-600">{expense.notes}</p>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    Categoría:
                  </span>
                  <span className="text-sm text-gray-600">{category?.name || expense.category}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    Fecha:
                  </span>
                  <span className="text-sm text-gray-600">{formatDate(expense.date)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(expense)}
                className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(expense.id!)}
                className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ExpenseCardV2 };
