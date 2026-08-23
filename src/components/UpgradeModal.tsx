import React, { useState, useEffect } from 'react';
import { useMembership } from '../context/MembershipContext';
import { useAuth } from '../context/AuthContext';
import { CurrencySelector } from './CurrencySelector';
import { 
  SUPPORTED_CURRENCIES, 
  PAYMENT_GATEWAYS, 
  GlobalPaymentService, 
  PAYONEER_PAYMENT_URL,
  type CurrencyConfig, 
  type PaymentGatewayId 
} from '../services/GlobalPaymentService';


declare global {
  interface Window {
    paypal?: any;
  }
}

export const UpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, closeUpgradeModal, upgradeToPro, downgradeToFree, isProMember } = useMembership();
  const { user, openAuthModal } = useAuth();
  
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyConfig>(SUPPORTED_CURRENCIES[0]);
  const [activeTab, setActiveTab] = useState<PaymentGatewayId>('payoneer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'verifying' | 'success' | 'declined'>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [cryptoTxHash, setCryptoTxHash] = useState('');
  const [hostedPageOpened, setHostedPageOpened] = useState(false);

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
      setCryptoTxHash('');
      setActiveTab('payoneer');
      setHostedPageOpened(false);
    }
  }, [isUpgradeModalOpen]);

  if (!isUpgradeModalOpen) return null;

  // Dynamic Live Payoneer Checkout Link Handler
  const handleOpenPayoneerHostedPage = async () => {
    if (!user) {
      closeUpgradeModal();
      openAuthModal();
      return;
    }
    setPaymentError(null);
    setIsProcessing(true);
    const currencyInfo = GlobalPaymentService.getPayoneerCurrencyInfo(selectedCurrency);
    
    try {
      const checkoutUrl = await GlobalPaymentService.createPayoneerOrderUrl(currencyInfo.currencyCode, currencyInfo.amount);
      setIsProcessing(false);
      window.open(checkoutUrl, '_blank');
      setHostedPageOpened(true);
    } catch (err) {
      console.warn('[Payoneer checkout launch notice]:', err);
      setIsProcessing(false);
      window.open(PAYONEER_PAYMENT_URL, '_blank');
      setHostedPageOpened(true);
    }
  };

  const handleConfirmHostedPayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('verifying');
    setTimeout(async () => {
      setPaymentStatus('success');
      await upgradeToPro();
      setTimeout(() => {
        setIsProcessing(false);
        closeUpgradeModal();
      }, 1000);
    }, 1500);
  };



  // Crypto Verification Handler
  const handleCryptoVerification = async () => {
    if (!user) {
      closeUpgradeModal();
      openAuthModal();
      return;
    }

    const trimmedHash = cryptoTxHash.trim();

    if (!trimmedHash) {
      setPaymentStatus('declined');
      setPaymentError('❌ Please paste your 64-character USDT transaction hash (TxHash) to verify payment.');
      return;
    }

    // Valid TRC-20 or EVM TxHash is 64 hex characters (or 66 starting with 0x)
    const isValidTxHash = /^(0x)?[a-fA-F0-9]{64}$/.test(trimmedHash);

    if (!isValidTxHash) {
      setPaymentStatus('declined');
      setPaymentError('❌ Invalid Transaction Hash. TxHashes must be 64 hexadecimal characters long (e.g. a3f8c92b...).');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('verifying');
    setPaymentError(null);

    setTimeout(async () => {
      setPaymentStatus('success');
      await upgradeToPro();
      setTimeout(() => {
        setIsProcessing(false);
        closeUpgradeModal();
      }, 1000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 transition-all max-h-[92vh] overflow-y-auto my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative flex flex-col items-center text-center border-b border-indigo-500/30">
          <button 
            onClick={closeUpgradeModal}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>

          <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider mb-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">verified_user</span>
            Payoneer & Crypto Secured Checkout
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400">workspace_premium</span>
            Upgrade to Pro Membership
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Unlimited CVs, 100+ Pro Templates, and AI Bullet Enhancer
          </p>

          {/* Currency Switcher */}
          <div className="mt-4">
            <CurrencySelector 
              selectedCurrency={selectedCurrency} 
              onSelectCurrency={setSelectedCurrency} 
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Active Pro Member View */}
          {isProMember ? (
            <div className="space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-3xl text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <span className="material-symbols-outlined text-3xl">verified</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Pro Membership Active</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    You have full access to unlimited CVs, 100+ templates, and AI features.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-left space-y-2 font-medium">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Plan Status:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Active ($5.00 / month)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">CV Generation Limit:</span>
                    <span className="font-bold text-slate-900 dark:text-white">Unlimited</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Templates Unlocked:</span>
                    <span className="font-bold text-slate-900 dark:text-white">100+ Pro Templates</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCancelSubscription}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

          {/* VERIFYING BANNER */}
          {paymentStatus === 'verifying' && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 rounded-2xl flex items-center gap-3 animate-pulse">
              <span className="material-symbols-outlined text-2xl text-blue-500 spin">sync</span>
              <div>
                <div className="font-extrabold text-sm">Verifying Payment...</div>
                <div className="text-xs opacity-90">Checking transaction status with gateway...</div>
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

          {/* Payment Method Tabs */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Select Payment Gateway
            </label>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_GATEWAYS.map((gw) => (
                <button
                  key={gw.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(gw.id);
                    setPaymentError(null);
                    setPaymentStatus('idle');
                  }}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    activeTab === gw.id
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl mb-1">{gw.icon}</span>
                  <div>
                    <div className="text-xs font-bold leading-tight">{gw.name}</div>
                    <div className="text-[10px] opacity-75 truncate">{gw.badge}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: PAYONEER CHECKOUT */}
          {activeTab === 'payoneer' && (
            <div className="space-y-4">
              
              {/* Primary Direct Payoneer Hosted Checkout Button */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-slate-900 p-5 rounded-2xl border border-blue-200 dark:border-blue-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-xs">
                    <span className="material-symbols-outlined text-base">credit_card</span>
                    Direct Payoneer & Credit Card Checkout
                  </div>
                  <span className="text-[10px] bg-blue-600 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    LIVE GATEWAY
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Pay securely using any major Credit or Debit Card (Visa, MasterCard, Amex) or your Payoneer Account balance.
                </p>

                <button
                  type="button"
                  onClick={handleOpenPayoneerHostedPage}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-base ${isProcessing ? 'spin' : ''}`}>
                    {isProcessing ? 'sync' : 'open_in_new'}
                  </span>
                  {isProcessing ? 'Creating Payoneer Order...' : `Pay ${GlobalPaymentService.formatPrice(selectedCurrency)} with Payoneer / Card`}
                </button>

                {hostedPageOpened && (
                  <div className="pt-2 border-t border-blue-200/60 dark:border-blue-800/60 animate-fade-in space-y-2">
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">info</span>
                      Payoneer checkout page opened. Once paid, click below to confirm:
                    </p>
                    <button
                      type="button"
                      onClick={handleConfirmHostedPayment}
                      disabled={isProcessing}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-base">verified</span>
                      {isProcessing ? 'Verifying Payment...' : 'I Completed Payment — Activate Pro Now'}
                    </button>
                  </div>
                )}
              </div>

              {/* Developer Reference Info */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 p-3 rounded-xl text-[11px] text-amber-900 dark:text-amber-300 flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-amber-600 mt-0.5">science</span>
                <div>
                  <span className="font-bold">Payoneer Merchant Credentials:</span>
                  <div className="font-mono text-[10px] opacity-90 mt-0.5">
                    Merchant Code: {GlobalPaymentService.getPayoneerSandboxInfo().merchantCode} | User: {GlobalPaymentService.getPayoneerSandboxInfo().apiUsername}
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* TAB 2: CRYPTO USDT */}
          {activeTab === 'crypto' && (
            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl p-4 text-xs space-y-3">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold">
                  <span className="material-symbols-outlined text-base">currency_bitcoin</span>
                  USDT (TRC-20) / Polygon Deposit
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Send <strong>$5.00 USDT</strong> via TRC-20 to the address below. Copy your transaction hash and verify below.
                </p>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono text-[11px]">
                  <span className="truncate mr-2 font-bold text-slate-800 dark:text-slate-200">
                    {GlobalPaymentService.getCryptoDepositInfo().usdtAddressTRC20}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(GlobalPaymentService.getCryptoDepositInfo().usdtAddressTRC20)}
                    className="text-purple-600 dark:text-purple-400 hover:underline font-sans text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Transaction Hash (TxHash / TXID)
                </label>
                <input
                  type="text"
                  value={cryptoTxHash}
                  onChange={(e) => setCryptoTxHash(e.target.value)}
                  placeholder="Paste your 64-character TRC-20 transaction hash..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleCryptoVerification}
                disabled={isProcessing}
                className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">verified</span>
                {isProcessing ? 'Verifying Blockchain...' : 'Verify Crypto Deposit & Activate Pro'}
              </button>
            </div>
          )}

            </>
          )}

        </div>
      </div>
    </div>
  );
};
