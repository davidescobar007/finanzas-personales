import { formatDate, formatCurrency } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DateHeaderProps {
  date: string;
  isToday?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  count?: number;
  total?: number;
}

const DateHeader = ({ date, isToday, isExpanded = true, onToggle, count = 0, total = 0 }: DateHeaderProps) => {
  const isTodayCheck = new Date(date).toDateString() === new Date().toDateString();
  const displayDate = isTodayCheck ? "Hoy" : formatDate(date);

  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-2 sticky top-0 bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-100 hover:border-indigo-200 transition-all duration-300 z-10"
    >
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full" />
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            {displayDate}
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            {count} {count === 1 ? 'transacción' : 'transacciones'}
          </p>
        </div>
      </div>
      {total > 0 && (
        <p className="text-sm font-bold text-indigo-600">
          {formatCurrency(total)}
        </p>
      )}
      {onToggle && (
        <div className="ml-2 text-gray-400">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      )}
    </button>
  );
};

export { DateHeader };
