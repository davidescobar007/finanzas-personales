import { TransactionType } from "@/lib/db";
import { Button } from "./ui/button";
import { Edit2, Trash2, TrendingDown, TrendingUp, PiggyBank, Wallet, CreditCard, Banknote, Coins, Landmark, Building, Gift, Package, ShoppingBag, Receipt, Calculator, ArrowRightLeft, ArrowUpRight, ArrowDownRight, ArrowLeftRight, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Repeat, RefreshCw, RotateCw, ArrowUpDown, Minus, Plus, DollarSign, Euro, Bitcoin, Wallet2, Tag } from "lucide-react";

interface TransactionTypeCardProps {
  type: TransactionType;
  onEdit: (type: TransactionType) => void;
  onDelete: (id: number) => void;
}

const iconMap: Record<string, React.ElementType> = {
  TrendingDown,
  TrendingUp,
  PiggyBank,
  Wallet,
  CreditCard,
  Banknote,
  Coins,
  Landmark,
  Building,
  Gift,
  Package,
  ShoppingBag,
  Receipt,
  Calculator,
  ArrowRightLeft,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Repeat,
  RefreshCw,
  RotateCw,
  ArrowUpDown,
  Minus,
  Plus,
  DollarSign,
  Euro,
  Bitcoin,
  Wallet2,
};

const classificationConfig = {
  expense: { label: "Gasto", color: "bg-rose-100 text-rose-700", icon: TrendingDown },
  savings: { label: "Ahorro", color: "bg-emerald-100 text-emerald-700", icon: PiggyBank },
  investment: { label: "Inversión", color: "bg-blue-100 text-blue-700", icon: TrendingUp },
  transfer: { label: "Transferencia", color: "bg-purple-100 text-purple-700", icon: ArrowRightLeft },
};

const TransactionTypeCard = ({ type, onEdit, onDelete }: TransactionTypeCardProps) => {
  const IconComponent = iconMap[type.icon] || TrendingDown;
  const classification = classificationConfig[type.classification] || classificationConfig.expense;

  return (
    <div className="group bg-white rounded-2xl p-5 border-2 border-gray-100 hover:border-indigo-200 shadow-lg shadow-gray-100/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/20 hover:-translate-y-0.5">
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${type.color}15`, color: type.color }}
        >
          <IconComponent className="h-6 w-6" style={{ color: type.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-base truncate">{type.name}</h4>
          <div className="flex items-center gap-1.5 mt-1">
            <Tag className="h-3 w-3 text-gray-400" />
            <span className={`text-xs px-2 py-0.5 rounded-full ${classification.color}`}>
              {classification.label}
            </span>
          </div>
        </div>
        <div
          className="w-3 h-3 rounded-full shadow-sm"
          style={{ backgroundColor: type.color }}
        />
      </div>
      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(type)}
          className="flex-1 border-2 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
        >
          <Edit2 className="h-4 w-4 mr-1" />
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(type.id)}
          className="flex-1 border-2 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Eliminar
        </Button>
      </div>
    </div>
  );
};

export { TransactionTypeCard };
