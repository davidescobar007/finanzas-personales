import { useState } from "react";
import { PaymentMethod, TransactionType } from "@/lib/db";
import { Modal } from "./ui/modal";
import { Button } from "./ui/button";
import { PaymentMethodForm } from "./payment-method-form";
import { PaymentMethodCard } from "./payment-method-card";
import { TransactionTypeForm } from "./transaction-type-form";
import { TransactionTypeCard } from "./transaction-type-card";
import { CurrencySelector } from "./currency-selector";
import { Plus } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethods: PaymentMethod[];
  transactionTypes: TransactionType[];
  onSaveMethod: (method: Omit<PaymentMethod, "id"> & { id?: number }) => void;
  onEditMethod: (method: PaymentMethod) => void;
  onDeleteMethod: (id: number) => void;
  onSaveType: (type: Omit<TransactionType, "id"> & { id?: number }) => void;
  onEditType: (type: TransactionType) => void;
  onDeleteType: (id: number) => void;
  onCurrencyChange?: (currency: string) => void;
}

const SettingsModal = ({
  isOpen,
  onClose,
  paymentMethods,
  transactionTypes,
  onSaveMethod,
  onEditMethod,
  onDeleteMethod,
  onSaveType,
  onEditType,
  onDeleteType,
  onCurrencyChange,
}: SettingsModalProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | undefined>();
  const [isTypeFormOpen, setIsTypeFormOpen] = useState(false);
  const [editingType, setEditingType] = useState<TransactionType | undefined>();

  const handleOpenForm = () => {
    setEditingMethod(undefined);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMethod(undefined);
  };

  const handleSaveMethod = async (method: Omit<PaymentMethod, "id">) => {
    await onSaveMethod({ ...method, id: editingMethod?.id });
    handleCloseForm();
  };

  const handleEditMethodClick = (method: PaymentMethod) => {
    setEditingMethod(method);
    setIsFormOpen(true);
  };

  const handleDeleteMethodClick = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este método de pago?")) {
      try {
        await onDeleteMethod(id);
      } catch (error) {
        console.error("Error al eliminar método de pago:", error);
        alert("Error al eliminar el método de pago. Puede tener gastos asociados.");
      }
    }
  };

  const handleOpenTypeForm = () => {
    setEditingType(undefined);
    setIsTypeFormOpen(true);
  };

  const handleCloseTypeForm = () => {
    setIsTypeFormOpen(false);
    setEditingType(undefined);
  };

  const handleSaveType = async (type: Omit<TransactionType, "id">) => {
    await onSaveType({ ...type, id: editingType?.id });
    handleCloseTypeForm();
  };

  const handleEditTypeClick = (type: TransactionType) => {
    setEditingType(type);
    setIsTypeFormOpen(true);
  };

  const handleDeleteTypeClick = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este tipo de transacción?")) {
      try {
        await onDeleteType(id);
      } catch (error) {
        console.error("Error al eliminar tipo de transacción:", error);
        alert("Error al eliminar el tipo de transacción. Puede tener gastos asociados.");
      }
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Configuración"
        className="max-w-3xl"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">General</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <CurrencySelector onChange={onCurrencyChange} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Métodos de Pago</h3>
              <Button onClick={handleOpenForm} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo método
              </Button>
            </div>

            {paymentMethods.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-medium">No hay métodos de pago</p>
                <p className="text-sm mt-1">
                  Agrega tu primer método de pago para comenzar
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    onEdit={handleEditMethodClick}
                    onDelete={handleDeleteMethodClick}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Tipos de Transacción</h3>
              <Button onClick={handleOpenTypeForm} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo tipo
              </Button>
            </div>

            {transactionTypes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-medium">No hay tipos de transacción</p>
                <p className="text-sm mt-1">
                  Agrega tu primer tipo de transacción para comenzar
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {transactionTypes.map((type) => (
                  <TransactionTypeCard
                    key={type.id}
                    type={type}
                    onEdit={handleEditTypeClick}
                    onDelete={handleDeleteTypeClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      <PaymentMethodForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveMethod}
        method={editingMethod}
      />

      <TransactionTypeForm
        isOpen={isTypeFormOpen}
        onClose={handleCloseTypeForm}
        onSave={handleSaveType}
        type={editingType}
      />
    </>
  );
};

export { SettingsModal };
