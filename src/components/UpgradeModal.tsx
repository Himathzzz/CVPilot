import React, { useState, useEffect } from 'react';
import { useMembership } from '../context/MembershipContext';
import { CurrencySelector } from './CurrencySelector';
import { 
  SUPPORTED_CURRENCIES, 
  GlobalPaymentService, 
  type CurrencyConfig 
} from '../services/GlobalPaymentService';

declare global {
  interface Window {
    paypal?: any;
  }
}

export const UpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, closeUpgradeModal, downgradeToFree, isProMember } = useMembership();
  
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyConfig>(SUPPORTED_CURRENCIES[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'verifying' | 'success' | 'declined'>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your Pro Membership? You will revert to the free plan.')) {
      setIsProcessing(true);
      await downgradeToFree();
      setIsProcessing(false);
      closeUpgradeModal();
    }
  };

  // Reset state when modal opens
  useEffect(() => {
    if (isUpgradeModalOpen) {
      setPaymentError(null);
      setIsProcessing(false);
      setPaymentStatus('idle');
    }
  }, [isUpgradeModalOpen]);

  if (!isUpgradeModalOpen) return null;



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-850/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">workspace_premium</span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Upgrade to Pro</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Unlock Unlimited CVs, Executive Templates & AI Assistance</p>
          </div>
          <button 
            onClick={closeUpgradeModal}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto font-sans">
          
          {/* Currency Selector */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Select Currency
            </label>
            <CurrencySelector 
              selectedCurrency={selectedCurrency} 
              onSelectCurrency={setSelectedCurrency} 
            />
          </div>

          {/* Current Pro Membership Status Check */}
          {isProMember ? (
            <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-emerald-500">verified</span>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">You are a Pro Member!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Your subscription is active with unlimited CV access and Executive Templates unlocked.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCancelSubscription}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">cancel</span>
                  {isProcessing ? 'Cancelling Subscription...' : 'Cancel Pro Membership'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* SUCCESS BANNER */}
              {paymentStatus === 'success' && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-2xl flex items-center gap-3 animate-fade-in">
                  <span className="material-symbols-outlined text-2xl text-emerald-500">check_circle</span>
                  <div>
                    <div className="font-extrabold text-sm">🎉 Payment Verified Successfully!</div>
                    <div className="text-xs opacity-90">Activating your Pro Membership and unlocking all features...</div>
                  </div>
                </div>
              )}

              {/* DECLINED / ERROR BANNER */}
              {paymentError && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-300 rounded-xl text-xs font-bold leading-relaxed flex items-start gap-2">
                  <span className="material-symbols-outlined text-base text-rose-500 mt-0.5">error</span>
                  <span>{paymentError}</span>
                </div>
              )}

              {/* Price Banner */}
              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Plan Selected</span>
                  <div className="text-lg font-extrabold text-slate-900 dark:text-white">Pro Monthly Membership</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {GlobalPaymentService.formatPrice(selectedCurrency)}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">per month • cancel anytime</span>
                </div>
              </div>

              {/* PAYHERE COMING SOON SCREEN */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-4 shadow-xl relative overflow-hidden">
                {/* Background Decorative Mesh */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>

                {/* PayHere Logo Graphic */}
                <div className="flex justify-center items-center py-1">
                  <img 
                    src="/payhere-logo.png" 
                    alt="PayHere Payment Gateway" 
                    className="h-14 md:h-16 w-auto object-contain drop-shadow-md mx-auto"
                  />
                </div>

                {/* Status Tag */}
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    PayHere Coming Soon...
                  </span>
                </div>

                {/* Explanation Text */}
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-white">
                    PayHere Payment Gateway Coming Soon!
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Online checkout via Credit/Debit Cards (Visa, MasterCard, AMEX), eZ Cash, mCash, and Sampath Vishwa will be enabled very shortly!
                  </p>
                </div>

                {/* Supported Features Checklist */}
                <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/80 text-left text-xs space-y-2 text-slate-300">
                  <div className="font-bold text-white flex items-center gap-1.5 border-b border-slate-700/60 pb-2">
                    <span className="material-symbols-outlined text-emerald-400 text-base">verified</span>
                    Supported Payment Methods Upon Launch:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300 font-medium pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> Visa & MasterCard (LKR / USD)
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> American Express (AMEX)
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> eZ Cash & mCash Mobile Wallets
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> Sampath Vishwa Bank
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
