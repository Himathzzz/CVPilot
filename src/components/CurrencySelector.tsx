import React from 'react';
import { SUPPORTED_CURRENCIES, type CurrencyConfig } from '../services/GlobalPaymentService';

interface CurrencySelectorProps {
  selectedCurrency: CurrencyConfig;
  onSelectCurrency: (currency: CurrencyConfig) => void;
  className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onSelectCurrency,
  className = ''
}) => {
  return (
    <div className={`inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 ${className}`}>
      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 uppercase tracking-wider hidden sm:inline">
        Currency:
      </span>
      {SUPPORTED_CURRENCIES.map((curr) => {
        const isSelected = selectedCurrency.code === curr.code;
        return (
          <button
            key={curr.code}
            onClick={() => onSelectCurrency(curr)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              isSelected
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title={`${curr.name} (${curr.symbol})`}
          >
            <span>{curr.flag}</span>
            <span>{curr.code}</span>
          </button>
        );
      })}
    </div>
  );
};
