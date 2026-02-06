import { useState, useEffect } from "react";
import { Expense, Category, PaymentMethod, Fund, TransactionType } from "@/lib/db";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { Wallet, CreditCard, Banknote, Smartphone, Building, Landmark, Send, ArrowRight, CheckCircle, AlertCircle, TrendingDown, TrendingUp, PiggyBank, Coins, Gift, Package, ShoppingBag, Receipt, Calculator, ArrowRightLeft, Calendar, DollarSign, FileText } from "lucide-react";
import { formatCurrency, getSavedCurrency } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Wallet,
  CreditCard,
  Banknote,
  Smartphone,
  Building,
  Landmark,
  Send,
  ArrowRight,
  CheckCircle,
  AlertCircle,
};

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

const getPaymentMethodIcon = (iconName: string) => {
  const IconComponent = iconMap[iconName] || Wallet;
  return <IconComponent className="h-4 w-4 inline mr-1" />;
};

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, "id" | "createdAt">) => void;
  categories: Category[];
  paymentMethods: PaymentMethod[];
  transactionTypes: TransactionType[];
  funds?: (Fund & { progress: number })[];
  expense?: Expense;
}

const ExpenseForm = ({
  isOpen,
  onClose,
  onSave,
  categories,
  paymentMethods,
  transactionTypes,
  funds = [],
  expense,
}: ExpenseFormProps) => {
  const [formData, setFormData] = useState<Omit<Expense, "id" | "createdAt">>({
    title: "",
    amount: 0,
    category: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    paymentMethod: "Efectivo",
    type: "Gasto",
    fundId: undefined,
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        notes: expense.notes || "",
        paymentMethod: expense.paymentMethod,
        type: expense.type,
        fundId: expense.fundId,
      });
    } else {
      setFormData({
        title: "",
        amount: 0,
        category: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
        paymentMethod: "Efectivo",
        type: "Gasto",
        fundId: undefined,
      });
    }
  }, [expense, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.category) return;
    onSave(formData);
    onClose();
  };

  const handleFormClose = () => {
    onClose();
    setFormData({
      title: "",
      amount: 0,
      category: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
      paymentMethod: "Efectivo",
      type: "Gasto",
      fundId: undefined,
    });
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleFormClose}
      title={expense ? "Editar transacción" : "Nueva transacción"}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Título</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="title"
                placeholder="Ej: Supermercado"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">Monto</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount || ""}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                }
                required
                className="pl-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{getSavedCurrency()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">Tipo de Transacción</Label>
            <Select
              id="type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              required
            >
              <option value="">Seleccionar tipo</option>
              {transactionTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {getTransactionTypeIcon(type.icon)} {type.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">Categoría</Label>
            <Select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="paymentMethod" className="text-sm font-medium">Método de Pago</Label>
            <Select
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value })
              }
              required
            >
              <option value="">Seleccionar método</option>
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.name}>
                  {getPaymentMethodIcon(method.icon)} {method.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">Fecha</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {formData.type === "Gasto" && (
          <div className="space-y-2">
            <Label htmlFor="fundId" className="text-sm font-medium">Pagar desde Fondo (opcional)</Label>
            <Select
              id="fundId"
              value={formData.fundId ? formData.fundId.toString() : ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fundId: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
            >
              <option value="">No usar fondo</option>
              {funds.map((fund) => (
                <option key={fund.id} value={fund.id}>
                  {fund.icon} {fund.name} (disponible: {formatCurrency(fund.currentAmount)})
                </option>
              ))}
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">Notas (opcional)</Label>
          <Input
            id="notes"
            placeholder="Detalles adicionales..."
            value={formData.notes || ""}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleFormClose}
            className="flex-1 border-2 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 shadow-lg shadow-indigo-200 transition-all"
          >
            {expense ? "Guardar cambios" : "Agregar transacción"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { ExpenseForm };
