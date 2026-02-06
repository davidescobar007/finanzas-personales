import { Contribution } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Trash2, ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ContributionExtended extends Contribution {
  fundName?: string;
  fundIcon?: string;
  fundColor?: string;
}

interface ContributionsListProps {
  contributions: ContributionExtended[];
  onDelete?: (id: number) => void;
}

const ContributionsList = ({ contributions, onDelete }: ContributionsListProps) => {
  if (contributions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aportes recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No hay aportes registrados</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aportes recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {contributions.map((contribution) => (
            <div
              key={contribution.id}
              className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 hover:border-green-200 transition-all duration-300"
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: `${contribution.fundColor}15` }}
                >
                  {contribution.fundIcon || "💰"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {contribution.fundName}
                  </h4>
                  <p className="text-sm text-gray-500">{formatDate(contribution.date)}</p>
                  {contribution.notes && (
                    <p className="text-xs text-gray-400 truncate">
                      {contribution.notes}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <p className="text-lg font-bold text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4" />
                  {formatCurrency(contribution.amount)}
                </p>
                {onDelete && contribution.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => contribution.id && onDelete(contribution.id)}
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { ContributionsList };
