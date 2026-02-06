"use client";

import { useState, useEffect } from "react";
import { Fund } from "@/lib/db";
import { FundCard } from "@/components/fund-card";
import { FundForm } from "@/components/fund-form";
import { ContributionForm } from "@/components/contribution-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function FundsPage() {
  const [funds, setFunds] = useState<(Fund & { progress: number })[]>([]);
  const [isFundFormOpen, setIsFundFormOpen] = useState(false);
  const [isContributionFormOpen, setIsContributionFormOpen] = useState(false);
  const [editingFund, setEditingFund] = useState<Fund | undefined>();
  const [selectedFundId, setSelectedFundId] = useState<number | undefined>();

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      const response = await fetch("/api/funds");
      const data = await response.json();
      setFunds(data);
    } catch (error) {
      console.error("Error fetching funds:", error);
    }
  };

  const handleSaveFund = async (
    fund: Omit<Fund, "id" | "createdAt" | "currentAmount">
  ) => {
    try {
      const method = editingFund ? "PUT" : "POST";
      const url = editingFund
        ? `/api/funds/${editingFund.id}`
        : "/api/funds";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fund),
      });

      fetchFunds();
      setEditingFund(undefined);
    } catch (error) {
      console.error("Error saving fund:", error);
    }
  };

  const handleDeleteFund = async (id: number) => {
    try {
      const response = await fetch(`/api/funds/${id}`, { method: "DELETE" });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error al eliminar fondo:", error);
        throw new Error(error.error || "Error al eliminar");
      }

      fetchFunds();
    } catch (error) {
      console.error("Error deleting fund:", error);
      alert("Error al eliminar el fondo. Por favor, intenta de nuevo.");
    }
  };

  const handleEditFund = (fund: Fund) => {
    setEditingFund(fund);
    setIsFundFormOpen(true);
  };

  const handleOpenFundForm = () => {
    setEditingFund(undefined);
    setIsFundFormOpen(true);
  };

  const handleCloseFundForm = () => {
    setIsFundFormOpen(false);
    setEditingFund(undefined);
  };

  const handleOpenContributionForm = (fundId?: number) => {
    setSelectedFundId(fundId);
    setIsContributionFormOpen(true);
  };

  const handleCloseContributionForm = () => {
    setIsContributionFormOpen(false);
    setSelectedFundId(undefined);
  };

  const handleSaveContribution = async (contribution: any) => {
    try {
      await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contribution),
      });

      fetchFunds();
    } catch (error) {
      console.error("Error saving contribution:", error);
    }
  };

  const handleDeleteContribution = async (id: number) => {
    try {
      await fetch(`/api/contributions/${id}`, { method: "DELETE" });
      fetchFunds();
    } catch (error) {
      console.error("Error deleting contribution:", error);
    }
  };

  const totalSavings = funds.reduce((sum, fund) => sum + fund.currentAmount, 0);
  const totalSavingsTarget = funds.reduce((sum, fund) => sum + fund.targetAmount, 0);

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Mis Fondos de Ahorro
            </h2>
            <p className="text-gray-500 mt-1">
              Gestiona tus metas de ahorro y ahorra para tus objetivos
            </p>
          </div>
          <Button onClick={handleOpenFundForm} size="lg" className="shadow-xl">
            <Plus className="h-5 w-5" />
            Nuevo fondo
          </Button>
        </div>
      </div>

      {funds.length > 0 ? (
        <>
          <div className="mb-6 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-600 mb-1">Total ahorrado</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(totalSavings)}
                </p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-600 mb-1">Meta total</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(totalSavingsTarget)}
                </p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-600 mb-1">Progreso general</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {totalSavingsTarget > 0 
                    ? ((totalSavings / totalSavingsTarget) * 100).toFixed(1)
                    : "0"}%
                </p>
              </div>
            </div>
            {totalSavingsTarget > 0 && (
              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min((totalSavings / totalSavingsTarget) * 100, 100)}%`,
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {funds.map((fund) => (
              <FundCard
                key={fund.id}
                fund={fund}
                onAddContribution={handleOpenContributionForm}
                onAddExpense={(fundId) => {
                  setSelectedFundId(fundId);
                }}
                onEdit={handleEditFund}
                onDelete={handleDeleteFund}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No tienes fondos de ahorro aún
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Crea tu primer fondo para empezar a ahorrar hacia tus objetivos financieros
          </p>
          <Button onClick={handleOpenFundForm} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Crear primer fondo
          </Button>
        </div>
      )}

      <FundForm
        isOpen={isFundFormOpen}
        onClose={handleCloseFundForm}
        onSave={handleSaveFund}
        fund={editingFund}
      />

      <ContributionForm
        isOpen={isContributionFormOpen}
        onClose={handleCloseContributionForm}
        onSave={handleSaveContribution}
        funds={funds}
        selectedFundId={selectedFundId}
      />
    </div>
  );
}
