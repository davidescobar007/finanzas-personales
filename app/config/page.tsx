"use client";

import { useState, useEffect } from "react";
import { PaymentMethod, Category, TransactionType } from "@/lib/db";
import { PaymentMethodCard } from "@/components/payment-method-card";
import { PaymentMethodForm } from "@/components/payment-method-form";
import { CategoryCard } from "@/components/category-card";
import { CategoryForm } from "@/components/category-form";
import { TransactionTypeCard } from "@/components/transaction-type-card";
import { TransactionTypeForm } from "@/components/transaction-type-form";
import { CurrencySelector } from "@/components/currency-selector";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ConfigPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>([]);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | undefined>();
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [editingTransactionType, setEditingTransactionType] = useState<TransactionType | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isTransactionTypeFormOpen, setIsTransactionTypeFormOpen] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
    fetchCategories();
    fetchTransactionTypes();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch("/api/payment-methods");
      const data = await response.json();
      setPaymentMethods(data);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTransactionTypes = async () => {
    try {
      const response = await fetch("/api/transaction-types");
      const data = await response.json();
      setTransactionTypes(data);
    } catch (error) {
      console.error("Error fetching transaction types:", error);
    }
  };

  const handleSavePaymentMethod = async (data: Omit<PaymentMethod, "id"> & { id?: number }) => {
    try {
      const existingMethod = editingPaymentMethod;
      const url = existingMethod
        ? `/api/payment-methods/${existingMethod.id}`
        : "/api/payment-methods";

      await fetch(url, {
        method: existingMethod ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      fetchPaymentMethods();
      setEditingPaymentMethod(undefined);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving payment method:", error);
    }
  };

  const handleEditPaymentMethod = (method: PaymentMethod) => {
    setEditingPaymentMethod(method);
    setIsFormOpen(true);
  };

  const handleDeletePaymentMethod = async (id: number) => {
    try {
      const response = await fetch(`/api/payment-methods/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al eliminar");
      }

      fetchPaymentMethods();
    } catch (error) {
      console.error("Error deleting payment method:", error);
      alert(error instanceof Error ? error.message : "Error al eliminar el método de pago");
    }
  };

  const handleCurrencyChange = () => {
    fetchPaymentMethods();
  };

  const handleSaveCategory = async (data: Omit<Category, "id"> & { id?: number }) => {
    try {
      const existingCategory = editingCategory;
      const url = existingCategory
        ? `/api/categories/${existingCategory.id}`
        : "/api/categories";

      await fetch(url, {
        method: existingCategory ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      fetchCategories();
      setEditingCategory(undefined);
      setIsCategoryFormOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryFormOpen(true);
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al eliminar");
      }

      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(error instanceof Error ? error.message : "Error al eliminar la categoría");
    }
  };

  const handleSaveTransactionType = async (data: Omit<TransactionType, "id"> & { id?: number }) => {
    try {
      const existingType = editingTransactionType;
      const url = existingType
        ? `/api/transaction-types/${existingType.id}`
        : "/api/transaction-types";

      await fetch(url, {
        method: existingType ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      fetchTransactionTypes();
      setEditingTransactionType(undefined);
      setIsTransactionTypeFormOpen(false);
    } catch (error) {
      console.error("Error saving transaction type:", error);
    }
  };

  const handleEditTransactionType = (type: TransactionType) => {
    setEditingTransactionType(type);
    setIsTransactionTypeFormOpen(true);
  };

  const handleDeleteTransactionType = async (id: number) => {
    try {
      const response = await fetch(`/api/transaction-types/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al eliminar");
      }

      fetchTransactionTypes();
    } catch (error) {
      console.error("Error deleting transaction type:", error);
      alert(error instanceof Error ? error.message : "Error al eliminar el tipo de transacción");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Configuración
            </h2>
            <p className="text-gray-500 mt-1">
              Personaliza tu experiencia financiera
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            General
          </h3>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moneda principal
              </label>
              <CurrencySelector onChange={handleCurrencyChange} />
              <p className="text-sm text-gray-500 mt-2">
                Esta moneda se utilizará para mostrar todos los montos en la aplicación
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Métodos de Pago
            </h3>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-5 w-5" />
              Nuevo método
            </Button>
          </div>

          {paymentMethods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paymentMethods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  onEdit={handleEditPaymentMethod}
                  onDelete={handleDeletePaymentMethod}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-4">
                No tienes métodos de pago configurados
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-5 w-5 mr-2" />
                Agregar primer método
              </Button>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Categorías
            </h3>
            <Button onClick={() => setIsCategoryFormOpen(true)}>
              <Plus className="h-5 w-5" />
              Nueva categoría
            </Button>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-4">
                No tienes categorías configuradas
              </p>
              <Button onClick={() => setIsCategoryFormOpen(true)}>
                <Plus className="h-5 w-5 mr-2" />
                Agregar primera categoría
              </Button>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Tipos de Transacción
            </h3>
            <Button onClick={() => setIsTransactionTypeFormOpen(true)}>
              <Plus className="h-5 w-5" />
              Nuevo tipo
            </Button>
          </div>

          {transactionTypes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transactionTypes.map((type) => (
                <TransactionTypeCard
                  key={type.id}
                  type={type}
                  onEdit={handleEditTransactionType}
                  onDelete={handleDeleteTransactionType}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-4">
                No tienes tipos de transacción configurados
              </p>
              <Button onClick={() => setIsTransactionTypeFormOpen(true)}>
                <Plus className="h-5 w-5 mr-2" />
                Agregar primer tipo
              </Button>
            </div>
          )}
        </div>
      </div>

      <PaymentMethodForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPaymentMethod(undefined);
        }}
        onSave={handleSavePaymentMethod}
        method={editingPaymentMethod}
      />

      <CategoryForm
        isOpen={isCategoryFormOpen}
        onClose={() => {
          setIsCategoryFormOpen(false);
          setEditingCategory(undefined);
        }}
        onSave={handleSaveCategory}
        category={editingCategory}
      />

      <TransactionTypeForm
        isOpen={isTransactionTypeFormOpen}
        onClose={() => {
          setIsTransactionTypeFormOpen(false);
          setEditingTransactionType(undefined);
        }}
        onSave={handleSaveTransactionType}
        type={editingTransactionType}
      />
    </div>
  );
}
