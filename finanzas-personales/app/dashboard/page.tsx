"use client";

import { useState, useEffect } from "react";
import { Expense, Category, PaymentMethod, TransactionType } from "@/lib/db";
import { ExpenseCardV2 } from "@/components/expense-card-v2";
import { DateHeader } from "@/components/date-header";
import { ExpenseForm } from "@/components/expense-form";
import { SummaryCards } from "@/components/summary-cards";
import { CategoryBreakdown } from "@/components/category-breakdown";
import { PaymentBreakdown } from "@/components/payment-breakdown";
import { PeriodSelector } from "@/components/period-selector";
import { FilterPanel } from "@/components/filter-panel";
import { ContributionsList } from "@/components/contributions-list";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  getPreviousMonth,
  getNextMonth,
  exportToCSV,
  formatCurrency,
} from "@/lib/utils";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const [funds, setFunds] = useState<any[]>([]);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [selectedFundId, setSelectedFundId] = useState<number | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [filters, setFilters] = useState<{
    category?: string;
    paymentMethod?: string;
    type?: string;
    minAmount?: number;
    maxAmount?: number;
  }>({});
  const [kpis, setKpis] = useState({
    totalExpenses: 0,
    totalSavings: 0,
    totalInvestments: 0,
    totalToTransfer: 0,
    count: 0,
  });
  const [paymentSummary, setPaymentSummary] = useState<any[]>([]);
  const [previousKpis, setPreviousKpis] = useState<
    | {
        totalExpenses: number;
        totalSavings: number;
        totalInvestments: number;
        totalToTransfer: number;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    fetchData();
  }, [selectedPeriod]);

  const fetchData = async () => {
    try {
      const [expensesRes, summaryRes, fundsRes, contributionsRes, transactionTypesRes] = await Promise.all([
        fetch(`/api/expenses?month=${selectedPeriod}`),
        fetch(`/api/summary?month=${selectedPeriod}&previousMonth=${getPreviousMonth(
          selectedPeriod
        )}`),
        fetch("/api/funds"),
        fetch(`/api/contributions?month=${selectedPeriod}`),
        fetch("/api/transaction-types"),
      ]);
      const expensesData = await expensesRes.json();
      const summaryData = await summaryRes.json();
      const fundsData = await fundsRes.json();
      const contributionsData = await contributionsRes.json();
      const transactionTypesData = await transactionTypesRes.json();

      setExpenses(expensesData);
      setCategories(summaryData.categories || []);
      setPaymentMethods(summaryData.paymentMethods || []);
      setTransactionTypes(transactionTypesData || []);
      setFunds(fundsData);
      setContributions(contributionsData);
      setKpis(summaryData.kpis);
      setPreviousKpis(summaryData.previousKpis);
      setPaymentSummary(summaryData.paymentSummary || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSaveExpense = async (
    expense: Omit<Expense, "id" | "createdAt">
  ) => {
    try {
      const method = editingExpense ? "PUT" : "POST";
      const url = editingExpense
        ? `/api/expenses/${editingExpense.id}`
        : "/api/expenses";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense),
      });

      fetchData();
      setEditingExpense(undefined);
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseFormOpen(true);
  };

  const handleOpenExpenseForm = () => {
    setEditingExpense(undefined);
    setSelectedFundId(undefined);
    setIsExpenseFormOpen(true);
  };

  const handleCloseExpenseForm = () => {
    setIsExpenseFormOpen(false);
    setEditingExpense(undefined);
    setSelectedFundId(undefined);
  };

  const handleOpenExpenseFormWithFund = (fundId: number) => {
    setSelectedFundId(fundId);
    setEditingExpense(undefined);
    setIsExpenseFormOpen(true);
  };

  const handlePeriodChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setSelectedPeriod(getPreviousMonth(selectedPeriod));
    } else {
      setSelectedPeriod(getNextMonth(selectedPeriod));
    }
  };

  const handleExportCSV = () => {
    const exportData = expenses.map((e) => ({
      id: e.id,
      título: e.title,
      monto: e.amount,
      categoría: e.category,
      método_pago: e.paymentMethod,
      tipo: e.type,
      fecha: e.date,
      notas: e.notes || "",
    }));
    exportToCSV(exportData, `transacciones-${selectedPeriod}`);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filters.category || expense.category === filters.category;
    const matchesPaymentMethod = !filters.paymentMethod || expense.paymentMethod === filters.paymentMethod;
    const matchesType = !filters.type || expense.type === filters.type;
    const matchesMin = filters.minAmount === undefined || expense.amount >= filters.minAmount;
    const matchesMax = filters.maxAmount === undefined || expense.amount <= filters.maxAmount;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPaymentMethod &&
      matchesType &&
      matchesMin &&
      matchesMax
    );
  });

  const recentExpenses = filteredExpenses.slice(0, 10);

  const expensesByDate = filteredExpenses.reduce((acc, expense) => {
    const date = expense.date;
    if (!acc[date]) {
      acc[date] = {
        date,
        expenses: [],
        total: 0,
      };
    }
    acc[date].expenses.push(expense);
    acc[date].total += expense.amount;
    return acc;
  }, {} as Record<string, { date: string; expenses: Expense[]; total: number }>);

  const expensesByDateSorted = Object.values(expensesByDate).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Resumen Financiero
            </h2>
            <p className="text-gray-500 mt-1">
              Visualiza y gestiona tus transacciones
            </p>
          </div>
          <Button onClick={handleOpenExpenseForm} size="lg" className="shadow-xl">
            <Plus className="h-5 w-5" />
            Nueva transacción
          </Button>
        </div>
      </div>

      <SummaryCards kpis={kpis} previousKpis={previousKpis} transactionTypes={transactionTypes} />

      <div className="mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <PeriodSelector
            currentPeriod={selectedPeriod}
            onPrevious={() => handlePeriodChange("prev")}
            onNext={() => handlePeriodChange("next")}
            onToday={() => setSelectedPeriod(new Date().toISOString().slice(0, 7))}
          />
          <FilterPanel
            categories={categories}
            paymentMethods={paymentMethods}
            transactionTypes={transactionTypes}
            onFiltersChange={setFilters}
            isOpen={isFilterPanelOpen}
            onToggle={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          />
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xl font-bold text-gray-900">Transacciones</h3>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar transacciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11"
              />
            </div>
          </div>

          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 pb-4">
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-medium">No hay transacciones</p>
                <p className="text-sm mt-1">
                  Agrega tu primera transacción para comenzar
                </p>
              </div>
            ) : (
              expensesByDateSorted.map(({ date, expenses, total }) => (
                <div key={date}>
                  <DateHeader
                    date={date}
                    count={expenses.length}
                    total={total}
                  />
                  <div className="space-y-3 mt-3">
                    {expenses.map((expense) => {
                      const category = categories.find((c) => c.name === expense.category);
                      const paymentMethod = paymentMethods.find(
                        (p) => p.name === expense.paymentMethod
                      );
                      return (
                        <ExpenseCardV2
                          key={expense.id}
                          expense={expense}
                          category={category}
                          paymentMethod={paymentMethod}
                          onEdit={handleEditExpense}
                          onDelete={handleDeleteExpense}
                        />
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <CategoryBreakdown
            data={categories
              .map((cat) => ({
                category: cat.name,
                total: expenses
                  .filter((e) => e.category === cat.name)
                  .reduce((sum, e) => sum + e.amount, 0),
              }))
              .filter((item) => item.total > 0)}
            categories={categories}
          />

          <PaymentBreakdown
            data={paymentSummary}
            paymentMethods={paymentMethods}
          />

          {contributions.length > 0 && (
            <ContributionsList
              contributions={contributions.slice(0, 5)}
              onDelete={(id) => {
                fetch(`/api/contributions/${id}`, { method: "DELETE" })
                  .then(() => fetchData());
              }}
            />
          )}
        </div>
      </div>

      <ExpenseForm
        isOpen={isExpenseFormOpen}
        onClose={handleCloseExpenseForm}
        onSave={handleSaveExpense}
        categories={categories}
        paymentMethods={paymentMethods}
        transactionTypes={transactionTypes}
        funds={funds}
        expense={editingExpense}
      />
    </div>
  );
}
