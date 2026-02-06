import { useState, useEffect } from "react";
import { Contribution, Fund } from "@/lib/db";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { formatCurrency } from "@/lib/utils";
import { PiggyBank, DollarSign, Calendar, FileText } from "lucide-react";

interface ContributionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contribution: Omit<Contribution, "id" | "createdAt">) => void;
  funds: (Fund & { progress: number })[];
  selectedFundId?: number;
}

const ContributionForm = ({
  isOpen,
  onClose,
  onSave,
  funds,
  selectedFundId,
}: ContributionFormProps) => {
  const [formData, setFormData] = useState<Omit<Contribution, "id" | "createdAt">>({
    fundId: selectedFundId || funds[0]?.id || 0,
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    if (selectedFundId) {
      setFormData((prev) => ({ ...prev, fundId: selectedFundId }));
    }
  }, [selectedFundId, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.fundId) return;
    onSave(formData);
    onClose();
  };

  const handleFormClose = () => {
    onClose();
    setFormData({
      fundId: selectedFundId || funds[0]?.id || 0,
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
  };

  const selectedFund = funds.find((f) => f.id === formData.fundId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleFormClose}
      title="Agregar aporte"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fundId" className="text-sm font-medium">Fondo</Label>
          <Select
            id="fundId"
            value={formData.fundId.toString()}
            onChange={(e) =>
              setFormData({ ...formData, fundId: parseInt(e.target.value) })
            }
            required
          >
            {funds.map((fund) => (
              <option key={fund.id} value={fund.id}>
                {fund.icon} {fund.name} ({fund.progress.toFixed(0)}%)
              </option>
            ))}
          </Select>
          {selectedFund && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 border border-indigo-100">
              <p className="text-xs text-gray-600">
                Progreso:{" "}
                <span className="font-semibold text-indigo-600">
                  {formatCurrency(selectedFund.currentAmount)}
                </span>{" "}
                de{" "}
                <span className="font-semibold text-gray-900">
                  {formatCurrency(selectedFund.targetAmount)}
                </span>
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${selectedFund.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">Monto del aporte</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount || ""}
              onChange={(e) =>
                setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
              }
              required
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium">Fecha del aporte</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">Notas (opcional)</Label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="notes"
              placeholder="Detalles del aporte..."
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="pl-10"
            />
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
            Agregar aporte
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { ContributionForm };
