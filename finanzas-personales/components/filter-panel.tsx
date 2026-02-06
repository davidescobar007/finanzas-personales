import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Select } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Filter, X, SlidersHorizontal, TrendingDown, TrendingUp, PiggyBank, Wallet, CreditCard, Banknote, Coins, Landmark, Building, Gift, Package, ShoppingBag, Receipt, Calculator, ArrowRightLeft } from "lucide-react";
import { cn, getSavedCurrency } from "@/lib/utils";
import { TransactionType } from "@/lib/db";

interface Filters {
  category?: string;
  paymentMethod?: string;
  type?: string;
  minAmount?: number;
  maxAmount?: number;
}

interface FilterPanelProps {
  categories: { name: string; icon: string }[];
  paymentMethods: { name: string; icon: string }[];
  transactionTypes: TransactionType[];
  onFiltersChange: (filters: Filters) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const transactionTypeIconMap: Record<string, React.ElementType> = {
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
};

const getTransactionTypeIcon = (iconName: string) => {
  const IconComponent = transactionTypeIconMap[iconName] || TrendingDown;
  return <IconComponent className="h-4 w-4 inline mr-1" />;
};

const FilterPanel = ({
  categories,
  paymentMethods,
  transactionTypes,
  onFiltersChange,
  isOpen,
  onToggle,
}: FilterPanelProps) => {
  const [filters, setFilters] = useState<Filters>({});

  const handleFilterChange = (key: keyof Filters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== ""
  );

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        variant={hasActiveFilters ? "default" : "outline"}
        className={cn(
          "shadow-lg transition-all duration-300",
          hasActiveFilters 
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
            : "hover:border-indigo-300 hover:bg-indigo-50"
        )}
      >
        <SlidersHorizontal className="h-5 w-5" />
        {hasActiveFilters && "Filtros Activos"}
        {!hasActiveFilters && "Filtros"}
        {hasActiveFilters && (
          <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
            {Object.values(filters).filter(v => v !== undefined && v !== "").length}
          </span>
        )}
      </Button>
    );
  }

  return (
    <Card className="mb-6 border-2 border-gray-100 hover:border-indigo-200 transition-all duration-300 shadow-lg shadow-indigo-100/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            Filtros Avanzados
          </CardTitle>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
              >
                <X className="h-4 w-4 mr-1.5" />
                Limpiar
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-9 w-9 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="space-y-2">
            <Label htmlFor="filter-category" className="text-sm font-medium text-gray-700">Categoría</Label>
            <Select
              id="filter-category"
              value={filters.category || ""}
              onChange={(e) =>
                handleFilterChange("category", e.target.value)
              }
              className="bg-white"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-payment" className="text-sm font-medium text-gray-700">Método de Pago</Label>
            <Select
              id="filter-payment"
              value={filters.paymentMethod || ""}
              onChange={(e) =>
                handleFilterChange("paymentMethod", e.target.value)
              }
              className="bg-white"
            >
              <option value="">Todos los métodos</option>
              {paymentMethods.map((method) => (
                <option key={method.name} value={method.name}>
                  {method.icon} {method.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-type" className="text-sm font-medium text-gray-700">Tipo de Transacción</Label>
            <Select
              id="filter-type"
              value={filters.type || ""}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="bg-white"
            >
              <option value="">Todos los tipos</option>
              {transactionTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {getTransactionTypeIcon(type.icon)} {type.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-min" className="text-sm font-medium text-gray-700">Monto Mínimo</Label>
            <div className="relative">
              <Input
                id="filter-min"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={filters.minAmount || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "minAmount",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="pl-10"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{getSavedCurrency()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-max" className="text-sm font-medium text-gray-700">Monto Máximo</Label>
            <div className="relative">
              <Input
                id="filter-max"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={filters.maxAmount || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "maxAmount",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="pl-10"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{getSavedCurrency()}</span>
            </div>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full h-11 border-2 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { FilterPanel };
