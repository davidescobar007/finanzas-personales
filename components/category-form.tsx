import { useState, useEffect } from "react";
import { Category } from "@/lib/db";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { Tag, Palette, ShoppingCart, Pizza, Car, Home, Gamepad2, Pill, FileText, ShoppingBag, Heart, Lightbulb, TrendingUp, Package, Gift, Plane, GraduationCap, Baby, PawPrint, Palette as Art, Book, Film, Music, Dumbbell, Wine, Coffee, Utensils, Briefcase, Wifi, Zap, Droplets, Flame, Snowflake, Sun, Moon, Star, Sparkles, Crown, Diamond, Gem, Trophy, Medal, Award, Flag, MapPin, Clock, Timer, Calendar, CalendarDays, Watch, AlarmClock, Hourglass, Globe, Map, Compass, Navigation, Route, Navigation2, ArrowUpRight, ArrowDownRight, ArrowLeftRight, ArrowUpDown, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Target, Crosshair } from "lucide-react";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, "id">) => void;
  category?: Category;
}

const iconOptions = [
  { name: "ShoppingCart", label: "Supermercado", icon: ShoppingCart },
  { name: "Pizza", label: "Comida", icon: Pizza },
  { name: "Car", label: "Transporte", icon: Car },
  { name: "Home", label: "Vivienda", icon: Home },
  { name: "Gamepad2", label: "Entretenimiento", icon: Gamepad2 },
  { name: "Pill", label: "Salud", icon: Pill },
  { name: "FileText", label: "Documentos", icon: FileText },
  { name: "ShoppingBag", label: "Compras", icon: ShoppingBag },
  { name: "Heart", label: "Wellness", icon: Heart },
  { name: "Lightbulb", label: "Servicios", icon: Lightbulb },
  { name: "TrendingUp", label: "Inversiones", icon: TrendingUp },
  { name: "Package", label: "Otros", icon: Package },
  { name: "Gift", label: "Regalos", icon: Gift },
  { name: "Plane", label: "Viajes", icon: Plane },
  { name: "GraduationCap", label: "Educación", icon: GraduationCap },
  { name: "Baby", label: "Niños", icon: Baby },
  { name: "PawPrint", label: "Mascotas", icon: PawPrint },
  { name: "Art", label: "Belleza", icon: Palette },
  { name: "Book", label: "Libros", icon: Book },
  { name: "Film", label: "Cine", icon: Film },
  { name: "Music", label: "Música", icon: Music },
  { name: "Dumbbell", label: "Deportes", icon: Dumbbell },
  { name: "Wine", label: "Restaurante", icon: Wine },
  { name: "Coffee", label: "Café", icon: Coffee },
  { name: "Utensils", label: "Comedor", icon: Utensils },
  { name: "Briefcase", label: "Trabajo", icon: Briefcase },
  { name: "Wifi", label: "Internet", icon: Wifi },
  { name: "Zap", label: "Electricidad", icon: Zap },
  { name: "Droplets", label: "Agua", icon: Droplets },
  { name: "Flame", label: "Gas", icon: Flame },
  { name: "Snowflake", label: "Clima", icon: Snowflake },
  { name: "Sun", label: "Verano", icon: Sun },
  { name: "Moon", label: "Noche", icon: Moon },
  { name: "Star", label: "Favoritos", icon: Star },
  { name: "Sparkles", label: "Especiales", icon: Sparkles },
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

const CategoryForm = ({
  isOpen,
  onClose,
  onSave,
  category,
}: CategoryFormProps) => {
  const [formData, setFormData] = useState<Omit<Category, "id">>({
    name: "",
    icon: "ShoppingCart",
    color: "#3b82f6",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        icon: category.icon,
        color: category.color,
      });
    } else {
      setFormData({
        name: "",
        icon: "ShoppingCart",
        color: "#3b82f6",
      });
    }
  }, [category, isOpen]);

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
      icon: "ShoppingCart",
      color: "#3b82f6",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleFormClose}
      title={category ? "Editar categoría" : "Nueva categoría"}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Nombre de la categoría</Label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              placeholder="Ej: Supermercado"
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
            {iconOptions.map((icon) => {
              const IconComponent = icon.icon;
              return (
                <option key={icon.name} value={icon.name}>
                  {icon.label}
                </option>
              );
            })}
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
            {category ? "Guardar cambios" : "Crear categoría"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { CategoryForm };
