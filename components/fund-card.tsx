import { Fund } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, TrendingUp, Target, Calendar, ArrowDownRight, Edit2, Trash2, CheckCircle, PiggyBank, Gift, Car, Plane, Home, Laptop, Smartphone, GraduationCap, HeartPulse, Music, Book, Gamepad2, Sparkles, Flower, Trees, Sun, Moon, Star, Trophy, Crown, Gem, Diamond, Briefcase, Building, Landmark, Wallet, CreditCard, Banknote, Coins, ShoppingBag, Wrench, Hammer, Scissors, Paintbrush, Camera, Phone, Watch, Clock, Timer, Map, Globe, Compass, Navigation, Route, PartyPopper, Balloon, Cake, Wine, Utensils, Coffee, Pizza, Sandwich, Cookie, IceCream, Candy, Flame, Snowflake, Droplets, Zap, Lightbulb } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface FundCardProps {
  fund: Fund & { progress: number };
  onAddContribution?: (fundId: number) => void;
  onAddExpense?: (fundId: number) => void;
  onEdit?: (fund: Fund) => void;
  onDelete?: (id: number) => void;
}

const iconMap: Record<string, React.ElementType> = {
  PiggyBank,
  Gift,
  Car,
  Plane,
  Home,
  Laptop,
  Smartphone,
  GraduationCap,
  HeartPulse,
  Music,
  Book,
  Gamepad2,
  Sparkles,
  Flower,
  Trees,
  Sun,
  Moon,
  Star,
  Trophy,
  Crown,
  Gem,
  Diamond,
  Briefcase,
  Building,
  Landmark,
  Wallet,
  CreditCard,
  Banknote,
  Coins,
  ShoppingBag,
  Wrench,
  Hammer,
  Scissors,
  Paintbrush,
  Camera,
  Phone,
  Watch,
  Clock,
  Timer,
  Map,
  Globe,
  Compass,
  Navigation,
  Route,
  PartyPopper,
  Balloon,
  Cake,
  Wine,
  Utensils,
  Coffee,
  Pizza,
  Sandwich,
  Cookie,
  IceCream,
  Candy,
  Flame,
  Snowflake,
  Droplets,
  Zap,
  Lightbulb,
};

const FundCard = ({
  fund,
  onAddContribution,
  onAddExpense,
  onEdit,
  onDelete,
}: FundCardProps) => {
  const isCompleted = fund.progress >= 100;
  const daysRemaining = fund.deadline
    ? Math.ceil((new Date(fund.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const IconComponent = iconMap[fund.icon] || PiggyBank;

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-indigo-200">
      <CardContent className="p-0">
        <div
          className="p-5"
          style={{ backgroundColor: `${fund.color}15` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: fund.color }}
              >
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{fund.name}</h3>
                {fund.deadline && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {daysRemaining !== null && daysRemaining > 0
                        ? `${daysRemaining} días restantes`
                        : daysRemaining !== null
                        ? "Fecha pasada"
                        : formatDate(fund.deadline)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onAddExpense && fund.currentAmount > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onAddExpense(fund.id!)}
                  className="h-8 w-8 hover:bg-orange-50 hover:text-orange-600"
                  title="Gastar desde fondo"
                >
                  <ArrowDownRight className="h-4 w-4" />
                </Button>
              )}
              {onAddContribution && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onAddContribution(fund.id!)}
                  className="h-8 w-8 hover:bg-green-50 hover:text-green-600"
                  title="Agregar aporte"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(fund)}
                  className="h-8 w-8 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(fund.id!);
                  }}
                  className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className={`h-4 w-4 ${isCompleted ? "text-green-600" : "text-blue-600"}`} />
                <span className="text-sm font-semibold text-gray-700">
                  {formatCurrency(fund.currentAmount)}
                </span>
                <span className="text-gray-400 text-sm">de {formatCurrency(fund.targetAmount)}</span>
              </div>
              <span
                className={`text-sm font-bold ${
                  isCompleted ? "text-green-600" : "text-blue-600"
                }`}
              >
                {fund.progress.toFixed(0)}%
              </span>
            </div>

            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${Math.min(fund.progress, 100)}%`,
                  backgroundColor: fund.color,
                }}
              />
            </div>

            {isCompleted && (
              <div className="flex items-center gap-1 text-xs text-green-600 font-medium mt-2">
                <CheckCircle className="h-4 w-4" />
                ¡Objetivo alcanzado!
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { FundCard };
