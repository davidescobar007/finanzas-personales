import { Expense, Category, PaymentMethod } from "@/lib/db";
import { formatCurrency, formatDate, getTransactionTypeName } from "@/lib/utils";
import { Trash2, Edit2, ArrowDownRight, ArrowUpRight, TrendingUp, ArrowUpDown, Wallet, CreditCard, Banknote, Smartphone, Building, Landmark, Send, ArrowRight, CheckCircle, AlertCircle, Wrench, Key, DollarSign, Coins, Repeat, ArrowUp, ArrowDown, ArrowLeftRight, RefreshCw, RotateCw, Clock, Timer, Calendar, Globe, Map, Compass, Navigation, Route, Home, Briefcase, Store, ShoppingCart, ShoppingBag, Tag, Ticket, Receipt, FileText, Archive, Box, Package, Truck, Plane, Train, Bike, Car, Bus, Ship, Rocket, Wifi, Signal, Radio, Tv, Monitor, Phone, Laptop, Tablet, Mouse, Keyboard, Headphones, Mic, Camera, Video, Image, Film, Music, Disc, HardDrive, Database, Server, Cloud, Sun, Moon, Star, Sparkles, Flame, Snowflake, Droplets, Lightbulb, Cpu, Code, Terminal, TerminalSquare, FileCode, FileJson, Github, Gitlab, GitBranch, GitCommit, GitMerge, GitPullRequest, Pizza, Gamepad2, Pill, Heart, Gift, GraduationCap, Baby, PawPrint, Palette, Book, Dumbbell, Wine, Coffee, Utensils, Zap } from "lucide-react";
import { Button } from "./ui/button";

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
  Wrench,
  Key,
  DollarSign,
  Coins,
  Repeat,
  ArrowUp,
  ArrowDown,
  ArrowLeftRight,
  RefreshCw,
  RotateCw,
  Clock,
  Timer,
  Calendar,
  Globe,
  Map,
  Compass,
  Navigation,
  Route,
  Home,
  Briefcase,
  Store,
  ShoppingCart,
  ShoppingBag,
  Tag,
  Ticket,
  Receipt,
  FileText,
  Archive,
  Box,
  Package,
  Truck,
  Plane,
  Train,
  Bike,
  Car,
  Bus,
  Ship,
  Rocket,
  Wifi,
  Signal,
  Radio,
  Tv,
  Monitor,
  Phone,
  Laptop,
  Tablet,
  Mouse,
  Keyboard,
  Headphones,
  Mic,
  Camera,
  Video,
  Image,
  Film,
  Music,
  Disc,
  HardDrive,
  Database,
  Server,
  Cloud,
  Sun,
  Moon,
  Star,
  Sparkles,
  Flame,
  Snowflake,
  Droplets,
  Lightbulb,
  Cpu,
  Code,
  Terminal,
  TerminalSquare,
  FileCode,
  FileJson,
  Github,
  Gitlab,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
};

const categoryIconMap: Record<string, React.ElementType> = {
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
  Palette,
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

const getPaymentMethodIcon = (iconName: string) => {
  const IconComponent = iconMap[iconName];
  if (IconComponent) {
    return <IconComponent className="w-full h-full" />;
  }
  return iconName;
};

const getCategoryIcon = (iconName: string) => {
  const IconComponent = categoryIconMap[iconName];
  if (IconComponent) {
    return <IconComponent className="w-full h-full" />;
  }
  return <Package className="w-full h-full" />;
};

interface ExpenseCardProps {
  expense: Expense;
  category?: Category;
  paymentMethod?: PaymentMethod;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: number) => void;
}

const ExpenseCard = ({
  expense,
  category,
  paymentMethod,
  onEdit,
  onDelete,
}: ExpenseCardProps) => {
  const getTypeConfig = () => {
    switch (expense.type) {
      case "Ahorro":
        return {
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          bgGradient: "from-emerald-500 to-teal-500",
          icon: <TrendingUp className="h-4 w-4" />,
          borderColor: "border-emerald-200",
        };
      case "Inversión":
        return {
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          bgGradient: "from-blue-500 to-indigo-500",
          icon: <ArrowUpRight className="h-4 w-4" />,
          borderColor: "border-blue-200",
        };
      case "Anticipo":
        return {
          color: "text-violet-600",
          bgColor: "bg-violet-50",
          bgGradient: "from-violet-500 to-purple-500",
          icon: <ArrowUpDown className="h-4 w-4" />,
          borderColor: "border-violet-200",
        };
      default:
        return {
          color: "text-rose-600",
          bgColor: "bg-rose-50",
          bgGradient: "from-rose-500 to-orange-500",
          icon: <ArrowDownRight className="h-4 w-4" />,
          borderColor: "border-rose-200",
        };
    }
  };

  const typeConfig = getTypeConfig();

  return (
    <div className="group bg-white rounded-2xl p-4 sm:p-5 border-2 border-gray-100 hover:border-indigo-200 shadow-lg shadow-gray-100/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/20 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-2xl shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${category?.color}15`, color: category?.color }}
          >
            {category?.icon ? getCategoryIcon(category.icon) : <Package className="h-6 w-6" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                {expense.title}
              </h4>
              <span className={`text-xs px-2.5 py-1.5 sm:px-2.5 sm:py-1 rounded-full ${typeConfig.bgColor} ${typeConfig.color} flex items-center gap-1.5 font-medium border ${typeConfig.borderColor} shrink-0`}>
                <span className="flex items-center justify-center w-4 h-4">
                  {typeConfig.icon}
                </span>
                <span className="truncate max-w-[60px] sm:max-w-none">
                  {getTransactionTypeName(expense.type || "Gasto")}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm flex-wrap">
              <p className="text-gray-500 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 text-gray-400" />
                {formatDate(expense.date)}
              </p>
              <span className="text-gray-300">•</span>
              <span className="text-xs px-2.5 py-1.5 sm:px-2.5 sm:py-1 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1.5 font-medium border border-gray-200">
                <span className="flex items-center justify-center w-3.5 h-3.5 sm:w-3.5 sm:h-3.5">
                  {getPaymentMethodIcon(paymentMethod?.icon || "")}
                </span>
                <span className="truncate max-w-[80px] sm:max-w-none">
                  {paymentMethod?.name || expense.paymentMethod}
                </span>
              </span>
              {expense.fundId && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs px-2 py-1 sm:px-2.5 sm:py-1 rounded-full bg-violet-100 text-violet-600 border border-violet-200 font-medium">
                    Desde fondo
                  </span>
                </>
              )}
            </div>
            {expense.notes && (
              <p className="text-xs text-gray-400 mt-1.5 sm:mt-2 truncate bg-gray-50 px-2 py-1 rounded-lg inline-block">
                {expense.notes}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0 min-w-[120px] sm:min-w-[140px]">
          <p className={`text-base sm:text-xl font-bold flex items-center justify-end gap-1.5 ${typeConfig.color} truncate w-full`}>
            <span className="truncate max-w-full text-right">
              {formatCurrency(expense.amount)}
            </span>
          </p>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(expense)}
                className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(expense.id!)}
                className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ExpenseCard };
