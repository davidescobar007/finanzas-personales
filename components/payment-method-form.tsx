import { useState, useEffect } from "react";
import { PaymentMethod } from "@/lib/db";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { CreditCard, Palette, Wallet, Banknote, Smartphone, Building, Landmark, Send, ArrowRight, CheckCircle, AlertCircle, Wrench, Key, CreditCard as Card, DollarSign, Coins, Repeat, ArrowUp, ArrowDown, ArrowLeftRight, RefreshCw, RotateCw, Clock, Timer, Calendar, CalendarDays, Globe, Map, Compass, Navigation, Route, Home, Briefcase, Store, ShoppingCart, ShoppingBag, Tag, Ticket, Receipt, FileText, Archive, Box, Package, Truck, Plane, Train, Bike, Car, Bus, Ship, Rocket, Zap, Wifi, Signal, Radio, Tv, Monitor, Phone, Smartphone as Mobile, Laptop, Tablet, Mouse, Keyboard, Headphones, Mic, Camera, Video, Image, Film, Music, Disc, HardDrive, Database, Server, Cloud, Sun, Moon, Star, Sparkles, Flame, Snowflake, Droplets, Lightbulb, Cpu, Cpu as Processor, Code, Terminal, TerminalSquare, FileCode, FileJson, Github, Gitlab, GitBranch, GitCommit, GitMerge, GitPullRequest } from "lucide-react";

interface PaymentMethodFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (method: Omit<PaymentMethod, "id">) => void;
  method?: PaymentMethod;
}

const iconOptions = [
  { name: "Wallet", label: "Billetera", icon: Wallet },
  { name: "CreditCard", label: "Tarjeta Crédito", icon: CreditCard },
  { name: "Banknote", label: "Efectivo", icon: Banknote },
  { name: "Smartphone", label: "Transferencia", icon: Smartphone },
  { name: "Building", label: "Banco", icon: Building },
  { name: "Landmark", label: "Banco Central", icon: Landmark },
  { name: "Send", label: "Enviar", icon: Send },
  { name: "ArrowRight", label: "Transferir", icon: ArrowRight },
  { name: "CheckCircle", label: "Verificado", icon: CheckCircle },
  { name: "AlertCircle", label: "Otros", icon: AlertCircle },
  { name: "Wrench", label: "Servicio", icon: Wrench },
  { name: "Key", label: "Clave", icon: Key },
  { name: "DollarSign", label: "Dólar", icon: DollarSign },
  { name: "Coins", label: "Monedas", icon: Coins },
  { name: "Repeat", label: "Recibir", icon: Repeat },
  { name: "ArrowUp", label: "Depósito", icon: ArrowUp },
  { name: "ArrowDown", label: "Retiro", icon: ArrowDown },
  { name: "ArrowLeftRight", label: "Intercambio", icon: ArrowLeftRight },
  { name: "RefreshCw", label: "Recargar", icon: RefreshCw },
  { name: "RotateCw", label: "Rotar", icon: RotateCw },
  { name: "Clock", label: "Hora", icon: Clock },
  { name: "Timer", label: "Tiempo", icon: Timer },
  { name: "Calendar", label: "Calendario", icon: Calendar },
  { name: "Globe", label: "Mundo", icon: Globe },
  { name: "Map", label: "Mapa", icon: Map },
  { name: "Home", label: "Casa", icon: Home },
  { name: "Briefcase", label: "Trabajo", icon: Briefcase },
  { name: "Store", label: "Tienda", icon: Store },
  { name: "ShoppingCart", label: "Carrito", icon: ShoppingCart },
  { name: "ShoppingBag", label: "Bolsa", icon: ShoppingBag },
  { name: "Tag", label: "Etiqueta", icon: Tag },
  { name: "Ticket", label: "Ticket", icon: Ticket },
  { name: "Receipt", label: "Recibo", icon: Receipt },
  { name: "FileText", label: "Documento", icon: FileText },
  { name: "Archive", label: "Archivo", icon: Archive },
  { name: "Box", label: "Caja", icon: Box },
  { name: "Package", label: "Paquete", icon: Package },
  { name: "Truck", label: "Camión", icon: Truck },
  { name: "Plane", label: "Avión", icon: Plane },
  { name: "Train", label: "Tren", icon: Train },
  { name: "Bike", label: "Bicicleta", icon: Bike },
  { name: "Car", label: "Auto", icon: Car },
  { name: "Bus", label: "Bus", icon: Bus },
  { name: "Ship", label: "Barco", icon: Ship },
  { name: "Ship", label: "Barco grande", icon: Ship },
  { name: "Rocket", label: "Cohete", icon: Rocket },
  { name: "Wifi", label: "WiFi", icon: Wifi },
  { name: "Signal", label: "Señal", icon: Signal },
  { name: "Radio", label: "Radio", icon: Radio },
  { name: "Tv", label: "Televisor", icon: Tv },
  { name: "Monitor", label: "Monitor", icon: Monitor },
  { name: "Phone", label: "Teléfono", icon: Phone },
  { name: "Laptop", label: "Laptop", icon: Laptop },
  { name: "Tablet", label: "Tablet", icon: Tablet },
  { name: "Mouse", label: "Mouse", icon: Mouse },
  { name: "Keyboard", label: "Teclado", icon: Keyboard },
  { name: "Headphones", label: "Audífonos", icon: Headphones },
  { name: "Mic", label: "Micrófono", icon: Mic },
  { name: "Camera", label: "Cámara", icon: Camera },
  { name: "Video", label: "Video", icon: Video },
  { name: "Image", label: "Imagen", icon: Image },
  { name: "Film", label: "Película", icon: Film },
  { name: "Music", label: "Música", icon: Music },
  { name: "Disc", label: "Disco", icon: Disc },
  { name: "HardDrive", label: "Disco Duro", icon: HardDrive },
  { name: "Database", label: "Base de Datos", icon: Database },
  { name: "Server", label: "Servidor", icon: Server },
  { name: "Cloud", label: "Nube", icon: Cloud },
  { name: "Sun", label: "Sol", icon: Sun },
  { name: "Moon", label: "Luna", icon: Moon },
  { name: "Star", label: "Estrella", icon: Star },
  { name: "Sparkles", label: "Destellos", icon: Sparkles },
  { name: "Flame", label: "Fuego", icon: Flame },
  { name: "Snowflake", label: "Nieve", icon: Snowflake },
  { name: "Droplets", label: "Gotas", icon: Droplets },
  { name: "Zap", label: "Rayo", icon: Zap },
  { name: "Lightbulb", label: "Foco", icon: Lightbulb },
  { name: "Cpu", label: "CPU", icon: Cpu },
  { name: "Processor", label: "Procesador", icon: Processor },
  { name: "Code", label: "Código", icon: Code },
  { name: "Terminal", label: "Terminal", icon: Terminal },
  { name: "TerminalSquare", label: "Terminal Cuadrado", icon: TerminalSquare },
  { name: "FileCode", label: "Archivo Código", icon: FileCode },
  { name: "FileJson", label: "Archivo JSON", icon: FileJson },
  { name: "Gitlab", label: "GitLab", icon: Gitlab },
  { name: "GitBranch", label: "Rama Git", icon: GitBranch },
  { name: "GitCommit", label: "Commit Git", icon: GitCommit },
  { name: "GitMerge", label: "Merge Git", icon: GitMerge },
  { name: "GitPullRequest", label: "Pull Request", icon: GitPullRequest },
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

const PaymentMethodForm = ({
  isOpen,
  onClose,
  onSave,
  method,
}: PaymentMethodFormProps) => {
  const [formData, setFormData] = useState<Omit<PaymentMethod, "id">>({
    name: "",
    icon: "Wallet",
    color: "#3b82f6",
  });

  useEffect(() => {
    if (method) {
      setFormData({
        name: method.name,
        icon: method.icon,
        color: method.color,
      });
    } else {
      setFormData({
        name: "",
        icon: "Wallet",
        color: "#3b82f6",
      });
    }
  }, [method, isOpen]);

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
      icon: "Wallet",
      color: "#3b82f6",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleFormClose}
      title={method ? "Editar método de pago" : "Nuevo método de pago"}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Nombre del método</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              placeholder="Ej: Lulo Bank"
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
            {method ? "Guardar cambios" : "Crear método"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { PaymentMethodForm };
