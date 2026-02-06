import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { CURRENCIES, getSavedCurrency, setSavedCurrency } from "@/lib/utils";

interface CurrencySelectorProps {
  onChange?: (currency: string) => void;
}

const CurrencySelector = ({ onChange }: CurrencySelectorProps) => {
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    setSavedCurrency(newCurrency);
    onChange?.(newCurrency);
  };

  return (
    <div>
      <Label htmlFor="currency">Divisa Principal</Label>
      <Select
        id="currency"
        value={getSavedCurrency()}
        onChange={handleCurrencyChange}
        required
      >
        {CURRENCIES.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.symbol} {currency.name} ({currency.code})
          </option>
        ))}
      </Select>
    </div>
  );
};

export { CurrencySelector };
