import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: Currency[] = [
  { code: "EUR", symbol: "€", name: "Euro", locale: "es-ES" },
  { code: "USD", symbol: "$", name: "Dólar estadounidense", locale: "en-US" },
  { code: "MXN", symbol: "$", name: "Peso mexicano", locale: "es-MX" },
  { code: "COP", symbol: "$", name: "Peso colombiano", locale: "es-CO" },
  { code: "ARS", symbol: "$", name: "Peso argentino", locale: "es-AR" },
  { code: "GBP", symbol: "£", name: "Libra esterlina", locale: "en-GB" },
  { code: "JPY", symbol: "¥", name: "Yen japonés", locale: "ja-JP" },
  { code: "BRL", symbol: "R$", name: "Real brasileño", locale: "pt-BR" },
  { code: "CLP", symbol: "$", name: "Peso chileno", locale: "es-CL" },
  { code: "PEN", symbol: "S/", name: "Sol peruano", locale: "es-PE" },
];

export const DEFAULT_CURRENCY = "EUR";

export function getSavedCurrency(): string {
  if (typeof window === 'undefined') return DEFAULT_CURRENCY;
  const saved = localStorage.getItem('appCurrency');
  return saved || DEFAULT_CURRENCY;
}

export function setSavedCurrency(code: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('appCurrency', code);
}

export function formatCurrency(amount: number, currencyCode?: string): string {
  const code = currencyCode || getSavedCurrency();
  const currency = CURRENCIES.find(c => c.code === code) || CURRENCIES[0];

  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const formatter = new Intl.NumberFormat(currency.locale, options);
  return formatter.format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function getPreviousMonth(currentMonth: string): string {
  const date = new Date(currentMonth + "-01");
  date.setMonth(date.getMonth() - 1);
  return date.toISOString().slice(0, 7);
}

export function getNextMonth(currentMonth: string): string {
  const date = new Date(currentMonth + "-01");
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().slice(0, 7);
}

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string
): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]) as (keyof T)[];
  const csvHeaders = headers.join(",");
  
  const csvRows = data.map((row) => {
    return headers
      .map((header) => {
        const value = row[header];
        const stringValue = value !== undefined && value !== null ? String(value).replace(/"/g, '""') : "";
        return `"${stringValue}"`;
      })
      .join(",");
  });
  
  const csvContent = [csvHeaders, ...csvRows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getTransactionTypeName(type: string): string {
  const names: Record<string, string> = {
    "Gasto": "Gasto",
    "Ahorro": "Ahorro",
    "Inversión": "Inversión",
    "Anticipo": "Anticipo",
  };
  return names[type] || type;
}
