"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import ReactDOM from "react-dom";

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
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownLeft, setDropdownLeft] = useState<number | null>(null);

  const selectedCurrency = currencies.find(c => c.code === value);

  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownWidth = 256; // 64 * 4 (w-64)
      let left = rect.left;
      if (left + dropdownWidth > window.innerWidth - 8) {
        left = window.innerWidth - dropdownWidth - 8; // 8px margin from right
      }
      setDropdownLeft(left);
      setDropdownPosition(spaceBelow < 320 && spaceAbove > spaceBelow ? 'top' : 'bottom');
    }
  };

  const handleButtonClick = () => {
    updateDropdownPosition();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
    }
    // Optionally, update on window resize
    const handleResize = () => {
      if (isOpen) updateDropdownPosition();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCurrencySelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className="flex items-center space-x-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg px-4 py-2 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
      >
        <span className="text-lg">{selectedCurrency?.flag}</span>
        <span className="font-medium">{selectedCurrency?.code}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && typeof window !== 'undefined' && buttonRef.current && ReactDOM.createPortal(
        <div
          ref={dropdownRef}
          className={`fixed z-[9999] w-64 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-80 overflow-y-auto`}
          style={{
            left: dropdownLeft ?? buttonRef.current.getBoundingClientRect().left,
            top: dropdownPosition === 'top'
              ? buttonRef.current.getBoundingClientRect().top - 8 - 320 // 320px is approx dropdown height
              : buttonRef.current.getBoundingClientRect().bottom + 8,
          }}
        >
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleCurrencySelect(currency.code)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-700/50 transition-colors ${
                currency.code === value ? 'bg-slate-700/30' : ''
              }`}
            >
              <span className="text-lg">{currency.flag}</span>
              <div className="flex-1">
                <div className="font-medium text-white">{currency.name}</div>
                <div className="text-sm text-slate-400">{currency.code}</div>
              </div>
              {currency.code === value && (
                <Check className="w-4 h-4 text-orange-500" />
              )}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
} 