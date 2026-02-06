import { useState, useEffect } from "react";
import { TransactionType } from "@/lib/db";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { TrendingDown, Palette, TrendingUp, PiggyBank, Wallet, CreditCard, Banknote, Coins, Landmark, Building, Gift, Package, ShoppingBag, Receipt, Calculator, ArrowRightLeft, ArrowUpRight, ArrowDownRight, ArrowLeftRight, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Repeat, RefreshCw, RotateCw, ArrowUpDown, Minus, Plus, DollarSign, Euro, Bitcoin, Wallet2, Wallet as Wallet1, CreditCard as Card, Banknote as Note, Coins as Coin, Landmark as Bank, Building as Office, Gift as Present, Package as Box, ShoppingBag as Bag, Receipt as Bill, Calculator as Calc, ArrowRightLeft as Exchange, ArrowUpRight as UpRight, ArrowDownRight as DownRight, ArrowLeftRight as LeftRight, ArrowUp as Up, ArrowDown as Down, ArrowLeft as Left, ArrowRight as Right, Repeat as Redo, RefreshCw as Refresh, RotateCw as Rotate, ArrowUpDown as UpDown, Minus as Subtract, Plus as Add, DollarSign as Dollar, Euro as EuroSign, Bitcoin as BTC, PiggyBank as Piggy, Wallet as WalletIcon, CreditCard as CardIcon, Banknote as Cash, Coins as CoinsIcon, Landmark as BankIcon, Building as BuildingIcon, Gift as GiftIcon, Package as PackageIcon, ShoppingBag as ShoppingBagIcon, Receipt as ReceiptIcon, Calculator as CalculatorIcon, ArrowRightLeft as ExchangeIcon, ArrowUpRight as UpRightIcon, ArrowDownRight as DownRightIcon, ArrowLeftRight as LeftRightIcon, ArrowUp as UpIcon, ArrowDown as DownIcon, ArrowLeft as LeftIcon, ArrowRight as RightIcon, Repeat as RedoIcon, RefreshCw as RefreshIcon, RotateCw as RotateIcon, ArrowUpDown as UpDownIcon, Minus as SubtractIcon, Plus as AddIcon } from "lucide-react";

interface TransactionTypeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: Omit<TransactionType, "id">) => void;
  type?: TransactionType;
}

const iconOptions = [
  { name: "TrendingDown", label: "Flecha Abajo", icon: TrendingDown },
  { name: "TrendingUp", label: "Flecha Arriba", icon: TrendingUp },
  { name: "PiggyBank", label: "Hucha", icon: PiggyBank },
  { name: "Wallet", label: "Billetera", icon: Wallet },
  { name: "CreditCard", label: "Tarjeta Crédito", icon: CreditCard },
  { name: "Banknote", label: "Efectivo", icon: Banknote },
  { name: "Coins", label: "Monedas", icon: Coins },
  { name: "Landmark", label: "Banco", icon: Landmark },
  { name: "Building", label: "Edificio", icon: Building },
  { name: "Gift", label: "Regalo", icon: Gift },
  { name: "Package", label: "Paquete", icon: Package },
  { name: "ShoppingBag", label: "Bolsa Compras", icon: ShoppingBag },
  { name: "Receipt", label: "Recibo", icon: Receipt },
  { name: "Calculator", label: "Calculadora", icon: Calculator },
  { name: "ArrowRightLeft", label: "Transferencia", icon: ArrowRightLeft },
  { name: "ArrowUpRight", label: "Ingreso", icon: ArrowUpRight },
  { name: "ArrowDownRight", label: "Gasto", icon: ArrowDownRight },
  { name: "ArrowLeftRight", label: "Intercambio", icon: ArrowLeftRight },
  { name: "ArrowUp", label: "Depósito", icon: ArrowUp },
  { name: "ArrowDown", label: "Retiro", icon: ArrowDown },
  { name: "ArrowLeft", label: "Envío", icon: ArrowLeft },
  { name: "ArrowRight", label: "Recepción", icon: ArrowRight },
  { name: "Repeat", label: "Recurrente", icon: Repeat },
  { name: "RefreshCw", label: "Actualizar", icon: RefreshCw },
  { name: "RotateCw", label: "Rotación", icon: RotateCw },
  { name: "ArrowUpDown", label: "Flujo", icon: ArrowUpDown },
  { name: "Minus", label: "Disminución", icon: Minus },
  { name: "Plus", label: "Aumento", icon: Plus },
  { name: "DollarSign", label: "Dólares", icon: DollarSign },
  { name: "Euro", label: "Euros", icon: Euro },
  { name: "Bitcoin", label: "Bitcoin", icon: Bitcoin },
];

const colors = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#fbbf24",
  "#a3e635",
  "#4ade80",
  "#2dd4bf",
  "#38bdf8",
  "#60a5fa",
  "#818cf8",
  "#a78bfa",
  "#c084fc",
  "#e879f9",
  "#f472b6",
  "#fb7185",
];

const TransactionTypeForm = ({
  isOpen,
  onClose,
  onSave,
  type,
}: TransactionTypeFormProps) => {
  const [formData, setFormData] = useState<Omit<TransactionType, "id">>({
    name: "",
    icon: "TrendingDown",
    color: "#ef4444",
    classification: "expense",
  });

  useEffect(() => {
    if (type) {
      setFormData({
        name: type.name,
        icon: type.icon,
        color: type.color,
        classification: type.classification,
      });
    } else {
      setFormData({
        name: "",
        icon: "TrendingDown",
        color: "#ef4444",
        classification: "expense",
      });
    }
  }, [type, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.icon || !formData.color) return;
    onSave(formData);
    onClose();
  };

  const handleFormClose = () => {
    onClose();
    setFormData({
      name: "",
      icon: "TrendingDown",
      color: "#ef4444",
      classification: "expense",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleFormClose}
      title={type ? "Editar tipo de transacción" : "Nuevo tipo de transacción"}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Nombre del tipo</Label>
          <div className="relative">
            <TrendingDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              placeholder="Ej: Gasto"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon" className="text-sm font-medium">Icono</Label>
          <Select
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            required
          >
            {iconOptions.map((icon) => (
              <option key={icon.name} value={icon.name}>
                {icon.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color" className="text-sm font-medium flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Color
          </Label>
          <div className="grid grid-cols-10 gap-2 mt-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`h-10 rounded-xl transition-all duration-200 ${
                  formData.color === color
                    ? "ring-2 ring-offset-2 ring-indigo-600 scale-110 shadow-lg"
                    : "ring-1 ring-gray-200 hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="classification" className="text-sm font-medium">Clasificación (para tarjetas de resumen)</Label>
          <Select
            id="classification"
            value={formData.classification}
            onChange={(e) => setFormData({ ...formData, classification: e.target.value as 'expense' | 'savings' | 'investment' | 'transfer' })}
            required
          >
            <option value="expense">Gasto (para "Gastos del mes")</option>
            <option value="savings">Ahorro (para "Ahorros")</option>
            <option value="investment">Inversión (para "Inversiones")</option>
            <option value="transfer">Transferencia (para "Transferencias")</option>
          </Select>
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
            {type ? "Guardar cambios" : "Crear tipo"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { TransactionTypeForm };
