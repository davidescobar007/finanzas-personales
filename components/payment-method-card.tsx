import { PaymentMethod } from "@/lib/db";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Edit2, Trash2, Wallet, CreditCard, Banknote, Smartphone, Building, Landmark, Send, ArrowRight, CheckCircle, AlertCircle, Wrench, Key, DollarSign, Coins, Repeat, ArrowUp, ArrowDown, ArrowLeftRight, RefreshCw, RotateCw, Clock, Timer, Calendar, Globe, Map, Compass, Navigation, Route, Home, Briefcase, Store, ShoppingCart, ShoppingBag, Tag, Ticket, Receipt, FileText, Archive, Box, Package, Truck, Plane, Train, Bike, Car, Bus, Ship, Rocket, Wifi, Signal, Radio, Tv, Monitor, Phone, Laptop, Tablet, Mouse, Keyboard, Headphones, Mic, Camera, Video, Image, Film, Music, Disc, HardDrive, Database, Server, Cloud, Sun, Moon, Star, Sparkles, Flame, Snowflake, Droplets, Lightbulb, Cpu, Code, Terminal, TerminalSquare, FileCode, FileJson, Github, Gitlab, GitBranch, GitCommit, GitMerge, GitPullRequest } from "lucide-react";

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onEdit?: (method: PaymentMethod) => void;
  onDelete?: (id: number) => void;
}

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

const PaymentMethodCard = ({
  method,
  onEdit,
  onDelete,
}: PaymentMethodCardProps) => {
  const IconComponent = iconMap[method.icon] || Wallet;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-indigo-200">
      <CardContent className="p-4">
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: `${method.color}15` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: method.color }}
              >
                <IconComponent className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">{method.name}</h3>
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(method)}
                  className="h-8 w-8 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(method.id!)}
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

export { PaymentMethodCard };
