import React from "react";

const currencies = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },
];

export default function CurrencySelector({ value, onChange }: { value: string; onChange: (code: string) => void }) {
  return (
    <div className="inline-block">
      <label htmlFor="currency-select" className="sr-only">Currency</label>
      <select
        id="currency-select"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-slate-700/50 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        {currencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.name} ({c.code})
          </option>
        ))}
      </select>
    </div>
  );
} 