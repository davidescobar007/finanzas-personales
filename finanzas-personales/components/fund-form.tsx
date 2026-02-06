import { useState, useEffect } from "react";
import { Fund } from "@/lib/db";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { PiggyBank, Palette, Target, Calendar, Gift, Car, Plane, DollarSign, Home, Laptop, Smartphone, GraduationCap, HeartPulse, Music, Book, Gamepad2, Baby, PawPrint, Sparkles, Flower, Trees, Sun, Moon, Star, Trophy, Crown, Gem, Diamond, Briefcase, Building, Landmark, Wallet, CreditCard, Banknote, Coins, ShoppingBag, Home as HomeIcon, Wrench, Hammer, Scissors, Paintbrush, Camera, Phone, Watch, Clock, Timer, Map, Globe, Compass, Navigation, Route, ArrowUpRight, ArrowDownRight, ArrowLeftRight, ArrowUpDown, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Flame, Snowflake, Droplets, Zap, Lightbulb, PartyPopper, Balloon, Cake, Wine, Utensils, Coffee, Pizza, Sandwich, Cookie, IceCream, Candy } from "lucide-react";

interface FundFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fund: Omit<Fund, "id" | "createdAt" | "currentAmount">) => void;
  fund?: Fund;
}

const icons = [
  { name: "Gift", label: "Regalos", icon: Gift },
  { name: "Car", label: "Coche", icon: Car },
  { name: "Plane", label: "Viajes", icon: Plane },
  { name: "PiggyBank", label: "Ahorros", icon: PiggyBank },
  { name: "Home", label: "Casa", icon: HomeIcon },
  { name: "Laptop", label: "Tecnología", icon: Laptop },
  { name: "Smartphone", label: "Móvil", icon: Smartphone },
  { name: "GraduationCap", label: "Educación", icon: GraduationCap },
  { name: "HeartPulse", label: "Salud", icon: HeartPulse },
  { name: "Music", label: "Música", icon: Music },
  { name: "Book", label: "Libros", icon: Book },
  { name: "Gamepad2", label: "Juegos", icon: Gamepad2 },
  { name: "Sparkles", label: "Especiales", icon: Sparkles },
  { name: "Flower", label: "Naturaleza", icon: Flower },
  { name: "Trees", label: "Jardín", icon: Trees },
  { name: "Sun", label: "Verano", icon: Sun },
  { name: "Moon", label: "Noche", icon: Moon },
  { name: "Star", label: "Favoritos", icon: Star },
  { name: "Trophy", label: "Metas", icon: Trophy },
  { name: "Crown", label: "Premium", icon: Crown },
  { name: "Gem", label: "Joyas", icon: Gem },
  { name: "Diamond", label: "Diamantes", icon: Diamond },
  { name: "Briefcase", label: "Trabajo", icon: Briefcase },
  { name: "Building", label: "Inmuebles", icon: Building },
  { name: "Landmark", label: "Banco", icon: Landmark },
  { name: "Wallet", label: "Billetera", icon: Wallet },
  { name: "CreditCard", label: "Tarjeta", icon: CreditCard },
  { name: "Banknote", label: "Efectivo", icon: Banknote },
  { name: "Coins", label: "Monedas", icon: Coins },
  { name: "ShoppingBag", label: "Compras", icon: ShoppingBag },
  { name: "Wrench", label: "Herramientas", icon: Wrench },
  { name: "Hammer", label: "Construcción", icon: Hammer },
  { name: "Scissors", label: "Corte", icon: Scissors },
  { name: "Paintbrush", label: "Arte", icon: Paintbrush },
  { name: "Camera", label: "Fotografía", icon: Camera },
  { name: "Phone", label: "Comunicación", icon: Phone },
  { name: "Watch", label: "Reloj", icon: Watch },
  { name: "Clock", label: "Tiempo", icon: Clock },
  { name: "Timer", label: "Temporizador", icon: Timer },
  { name: "Map", label: "Mapa", icon: Map },
  { name: "Globe", label: "Mundo", icon: Globe },
  { name: "Compass", label: "Orientación", icon: Compass },
  { name: "Navigation", label: "Navegación", icon: Navigation },
  { name: "Route", label: "Ruta", icon: Route },
  { name: "Flame", label: "Fuego", icon: Flame },
  { name: "Snowflake", label: "Nieve", icon: Snowflake },
  { name: "Droplets", label: "Agua", icon: Droplets },
  { name: "Zap", label: "Electricidad", icon: Zap },
  { name: "Lightbulb", label: "Idea", icon: Lightbulb },
  { name: "PartyPopper", label: "Fiesta", icon: PartyPopper },
  { name: "Balloon", label: "Globos", icon: Balloon },
  { name: "Cake", label: "Pastel", icon: Cake },
  { name: "Flame", label: "Vela", icon: Flame },
  { name: "Wine", label: "Vino", icon: Wine },
  { name: "Utensils", label: "Comedor", icon: Utensils },
  { name: "Coffee", label: "Café", icon: Coffee },
  { name: "Pizza", label: "Pizza", icon: Pizza },
  { name: "Sandwich", label: "Sandwich", icon: Sandwich },
  { name: "Cookie", label: "Galleta", icon: Cookie },
  { name: "IceCream", label: "Helado", icon: IceCream },
  { name: "Candy", label: "Dulces", icon: Candy },
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

const FundForm = ({ isOpen, onClose, onSave, fund }: FundFormProps) => {
  const [formData, setFormData] = useState<Omit<Fund, "id" | "createdAt" | "currentAmount">>({
    name: "",
    targetAmount: 0,
    icon: "PiggyBank",
    color: "#3b82f6",
    deadline: "",
  });

  useEffect(() => {
    if (fund) {
      setFormData({
        name: fund.name,
        targetAmount: fund.targetAmount,
        icon: fund.icon,
        color: fund.color,
        deadline: fund.deadline || "",
      });
    } else {
      setFormData({
        name: "",
        targetAmount: 0,
        icon: "PiggyBank",
        color: "#3b82f6",
        deadline: "",
      });
    }
  }, [fund, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount) return;
    onSave(formData);
    onClose();
  };

  const handleFormClose = () => {
    onClose();
    setFormData({
      name: "",
      targetAmount: 0,
      icon: "PiggyBank",
      color: "#3b82f6",
      deadline: "",
    });
  };

  const IconComponent = icons.find(i => i.name === formData.icon)?.icon || PiggyBank;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleFormClose}
      title={fund ? "Editar fondo" : "Nuevo fondo"}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Nombre del fondo</Label>
          <div className="relative">
            <PiggyBank className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              placeholder="Ej: Regalos Navidad"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetAmount" className="text-sm font-medium">Monto objetivo</Label>
          <div className="relative">
            <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="targetAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.targetAmount || ""}
              onChange={(e) =>
                setFormData({ ...formData, targetAmount: parseFloat(e.target.value) || 0 })
              }
              required
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline" className="text-sm font-medium">Fecha límite (opcional)</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="deadline"
              type="date"
              value={formData.deadline || ""}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
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
            {icons.map((icon) => (
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
            {fund ? "Guardar cambios" : "Crear fondo"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { FundForm };
