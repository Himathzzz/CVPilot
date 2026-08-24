import React from 'react';

interface LegalModalProps {
  type: 'terms' | 'privacy' | 'refund' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 dark:bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gold/40 dark:border-slate-800 transition-colors duration-300">
        
        {/* Header */}
        <div className="bg-navy dark:bg-slate-950 text-white p-5 relative flex justify-between items-center border-b border-gold/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gold text-xl">gavel</span>
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white">
              {type === 'terms' && 'Terms of Service'}
              {type === 'privacy' && 'Privacy Policy'}
              {type === 'refund' && 'Return & Cancellation Policy'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          
          {type === 'terms' && (
            <>
              <p className="font-semibold">Last Updated: August 2026</p>
              <h4 className="font-bold text-sm text-navy dark:text-white uppercase mt-3">1. Acceptance of Terms</h4>
              <p>By accessing or using CV PILOT (https://cvpilot.space), you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.</p>
              
              <h4 className="font-bold text-sm text-navy dark:text-white uppercase mt-3">2. Membership & Subscriptions</h4>
              <p>CV PILOT offers a Basic Free Plan (1 CV limit) and a Pro Membership subscription priced at <strong>$5.00 / month</strong>. By subscribing to Pro, you authorize monthly recurring billing to your selected payment method until cancelled.</p>
              
              <h4 className="font-bold text-sm text-navy dark:text-white uppercase mt-3">3. Account & User Data</h4>
              <p>All resume data and uploaded content remain the intellectual property of the user. We respect user privacy and do not sell user data to third parties.</p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <p className="font-semibold">Last Updated: August 2026</p>
              <h4 className="font-bold text-sm text-navy dark:text-white uppercase mt-3">1. Information We Collect</h4>
              <p>We collect personal information provided directly by users, including name, contact details, work history, education, and payment information processed securely via PayHere LK.</p>
              
              <h4 className="font-bold text-sm text-navy dark:text-white uppercase mt-3">2. Data Security</h4>
              <p>All transmitted data is encrypted using 256-bit SSL encryption. We adhere to industry best practices to secure your resume content and payment tokens.</p>
            </>
          )}

          {type === 'refund' && (
            <>
              <p className="font-semibold">Last Updated: August 2026</p>
              <h4 className="font-bold text-sm text-navy dark:text-white uppercase mt-3">1. Cancellation Policy</h4>
              <p>You can cancel your Pro Membership ($5.00/month) at any time through your account settings or by contacting support. Upon cancellation, your subscription will remain active until the end of your current billing period.</p>
              
              <h4 className="font-bold text-sm text-navy dark:text-white uppercase mt-3">2. Refund Eligibility</h4>
              <p>We offer a 7-day money-back guarantee if you are dissatisfied with Pro services. Contact support at cvpilot.site.je@gmail.com for assistance.</p>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-navy dark:bg-gold text-white dark:text-navy font-bold text-xs px-5 py-2 rounded-lg uppercase tracking-wider shadow-sm"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};
