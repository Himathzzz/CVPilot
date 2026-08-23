import React, { useState } from 'react';
import { useMembership } from '../context/MembershipContext';
import { useAuth } from '../context/AuthContext';
import { CurrencySelector } from './CurrencySelector';
import { SUPPORTED_CURRENCIES, type CurrencyConfig } from '../services/GlobalPaymentService';

export const PricingSection: React.FC = () => {
  const { isProMember, openUpgradeModal } = useMembership();
  const { user, openAuthModal } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyConfig>(SUPPORTED_CURRENCIES[0]);

  const handleProClick = () => {
    if (isProMember) return;
    if (!user) {
      openAuthModal();
    } else {
      openUpgradeModal();
    }
  };

  return (
    <section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 border-t border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Simple, Transparent <span className="text-blue-600 dark:text-blue-400">Global Pricing</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg">
            Start free or upgrade to <strong className="text-blue-600 dark:text-blue-400">Pro Membership</strong> for unlimited CVs, 100+ Pro Templates, and AI assistance.
          </p>

          {/* Interactive Currency Switcher */}
          <div className="pt-2">
            <CurrencySelector 
              selectedCurrency={selectedCurrency} 
              onSelectCurrency={setSelectedCurrency} 
            />
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16 items-stretch">
          
          {/* Free Basic Plan Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">Basic Free Plan</h3>
                <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full">FREE FOREVER</span>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">$0</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/ forever</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                Ideal for entry-level professionals building their first resume.
              </p>
              
              <ul className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300 mb-8 font-medium">
                <li className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
                  <span><strong>1 CV Maximum</strong> Allowed</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
                  <span>4 Standard ATS Resume Templates</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
                  <span>Full PDF Export & Print Support</span>
                </li>
                <li className="flex items-center gap-2.5 opacity-50">
                  <span className="material-symbols-outlined text-slate-400 text-base">cancel</span>
                  <span className="line-through">100+ Pro Templates (Locked)</span>
                </li>
                <li className="flex items-center gap-2.5 opacity-50">
                  <span className="material-symbols-outlined text-slate-400 text-base">cancel</span>
                  <span className="line-through">Unlimited AI Bullet Enhancer</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                if (!user) openAuthModal();
              }}
              className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              {user ? 'Current Free Plan' : 'Get Started Free'}
            </button>
          </div>

          {/* Pro Membership Card */}
          <div className="bg-white dark:bg-slate-900 border-2 border-blue-600 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden transform md:-translate-y-2">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-indigo-600 text-white font-extrabold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-md">
              MOST POPULAR
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-blue-600">workspace_premium</span>
                  Pro Membership
                </h3>
                <span className="text-[11px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-0.5 rounded-full uppercase">
                  RECOMMENDED
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-4xl md:text-5xl font-black text-blue-600 dark:text-blue-400">
                  {selectedCurrency.symbol}{selectedCurrency.amount}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  / month • {selectedCurrency.code}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                Full access for ambitious professionals applying to multiple roles.
              </p>

              <ul className="space-y-3.5 text-xs text-slate-700 dark:text-slate-200 mb-8 font-medium">
                <li className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="material-symbols-outlined text-emerald-500 text-base">all_inclusive</span>
                  <span><strong>UNLIMITED CVs</strong> Generated & Saved</span>
                </li>
                <li className="flex items-center gap-2.5 font-bold">
                  <span className="material-symbols-outlined text-amber-500 text-base">stars</span>
                  <span>All <strong>100+ Pro Templates Unlocked</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-blue-600 text-base">auto_awesome</span>
                  <span>Unlimited AI Bullet Enhancer</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-blue-600 text-base">palette</span>
                  <span>Executive Theme Palettes & Fonts</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-blue-600 text-base">public</span>
                  <span>Global Access (Payoneer & Credit Cards / Crypto)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleProClick}
              disabled={isProMember}
              className={`w-full py-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isProMember
                  ? 'bg-emerald-600 text-white cursor-default shadow-sm'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 cursor-pointer'
              }`}
            >
              <span className="material-symbols-outlined text-base">{isProMember ? 'verified' : 'lock'}</span>
              {isProMember ? 'PRO MEMBER ACTIVE' : `UPGRADE TO PRO (${selectedCurrency.symbol}${selectedCurrency.amount}/MO)`}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
