import { Category } from "@/lib/db";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Edit2, Trash2, ShoppingCart, Pizza, Car, Home, Gamepad2, Pill, FileText, ShoppingBag, Heart, Lightbulb, TrendingUp, Package, Gift, Plane, GraduationCap, Baby, PawPrint, Palette as Art, Book, Film, Music, Dumbbell, Wine, Coffee, Utensils, Briefcase, Wifi, Zap, Droplets, Flame, Snowflake, Sun, Moon, Star, Sparkles } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (id: number) => void;
}

const iconMap: Record<string, React.ElementType> = {
  ShoppingCart,
  Pizza,
  Car,
  Home,
  Gamepad2,
  Pill,
  FileText,
  ShoppingBag,
  Heart,
  Lightbulb,
  TrendingUp,
  Package,
  Gift,
  Plane,
  GraduationCap,
  Baby,
  PawPrint,
  Art,
  Book,
  Film,
  Music,
  Dumbbell,
  Wine,
  Coffee,
  Utensils,
  Briefcase,
  Wifi,
  Zap,
  Droplets,
  Flame,
  Snowflake,
  Sun,
  Moon,
  Star,
  Sparkles,
};

const CategoryCard = ({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) => {
  const IconComponent = iconMap[category.icon] || Package;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-indigo-200">
      <CardContent className="p-4">
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: `${category.color}15` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: category.color }}
              >
                <IconComponent className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">{category.name}</h3>
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(category)}
                  className="h-8 w-8 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(category.id)}
                  className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { CategoryCard };
