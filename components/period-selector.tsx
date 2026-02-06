import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Calendar, CalendarDays } from "lucide-react";

interface PeriodSelectorProps {
  currentPeriod: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

const PeriodSelector = ({
  currentPeriod,
  onPrevious,
  onNext,
  onToday,
}: PeriodSelectorProps) => {
  const formatPeriod = (period: string) => {
    const [year, month] = period.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div className="flex items-center gap-2 bg-white rounded-2xl p-2.5 shadow-lg shadow-indigo-100/30 border-2 border-gray-100 hover:border-indigo-200 transition-all duration-300">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        className="h-10 w-10 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-3 flex-1 justify-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl px-4 py-2">
        <CalendarDays className="h-5 w-5 text-indigo-600" />
        <span className="font-semibold text-gray-900 text-lg min-w-[140px] text-center capitalize">
          {formatPeriod(currentPeriod)}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        className="h-10 w-10 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onToday}
        className="ml-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        <Calendar className="h-4 w-4 mr-1.5" />
        Hoy
      </Button>
    </div>
  );
};

export { PeriodSelector };
