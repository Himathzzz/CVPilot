import React from 'react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';

interface RefundPageProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  onNavigateBuilder: () => void;
}

export const RefundPage: React.FC<RefundPageProps> = ({
  onNavigateHome,
  onNavigateDashboard,
  onNavigateBuilder,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans transition-colors duration-300">
      <Navbar 
        onDashboardClick={onNavigateDashboard}
        onBuildResumeClick={onNavigateBuilder}
        onHomeClick={onNavigateHome}
      />

      <main className="w-full flex-grow py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          
          {/* Breadcrumb */}
          <div className="mb-8">
            <button 
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-wider cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Home
            </button>
          </div>

          {/* Document Container */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm space-y-8">
            
            {/* Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">assignment_return</span>
                Guarantee & Returns
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Return & Refund Policy
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Last Updated: August 20, 2026 • Effective Date: August 20, 2026
              </p>
            </div>

            {/* Guarantee Highlight Box */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider text-xs">
                <span className="material-symbols-outlined text-lg">verified</span>
                Risk-Free 7-Day Guarantee
              </div>
              <h2 className="text-xl font-extrabold">100% Satisfaction or Your Money Back</h2>
              <p className="text-xs text-blue-100 leading-relaxed">
                We want you to be completely satisfied with your Pro Membership. If CV PILOT does not meet your expectations, we will gladly issue a full refund within 7 days of purchase—no complex conditions required.
              </p>
            </div>

            {/* Content Body */}
            <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Refund Eligibility Window</h2>
                <p>
                  You are eligible for a full 100% refund on your Pro Membership subscription ($5.00/month or local equivalent) if your refund request is submitted within <strong>7 days</strong> of the initial purchase date or automatic monthly renewal date.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Subscription Cancellation Procedure</h2>
                <p>
                  You can cancel your recurring Pro Membership subscription at any time without fees:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Log in to your account at <a href="https://cvpilot.space" className="text-blue-600 dark:text-blue-400 underline">https://cvpilot.space</a>.</li>
                  <li>Navigate to your Account Dashboard or click "Cancel Pro Subscription" in the billing section.</li>
                  <li>Alternatively, click the Manage Subscription link in your PayHere email payment confirmation.</li>
                </ol>
                <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                  Upon cancellation, auto-renewal will cease immediately. You will retain full access to Pro features until the remainder of your paid billing period concludes.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Payment Gateway & Refund Disbursement</h2>
                <p>
                  Our orders and transactions are managed by <strong>PayHere (payhere.lk)</strong>.
                </p>
                <p className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                  <strong>PayHere Payments</strong> acts as our online payment processing gateway. Approved refunds are credited directly back to your original payment method (Credit/Debit Card, Mobile Wallet, or Net Banking) through PayHere's payment network within 3–5 business days depending on your issuing bank.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. How to Submit a Refund Request</h2>
                <p>To request a refund under our 7-day policy:</p>
                <div className="bg-blue-50 dark:bg-blue-950/40 p-5 rounded-xl border border-blue-200 dark:border-blue-800 space-y-3 text-xs text-blue-950 dark:text-blue-200">
                  <p><strong>Option A: Direct Support Email (Recommended)</strong></p>
                  <p>Send an email to <a href="mailto:cvpilot.site.je@gmail.com" className="font-bold underline text-blue-600 dark:text-blue-400">cvpilot.site.je@gmail.com</a> with your account email address and order number. Our team responds within 24 hours to process your refund.</p>
                  <hr className="border-blue-200 dark:border-blue-800" />
                  <p><strong>Option B: PayHere Payment Support</strong></p>
                  <p>Visit PayHere Support at <a href="https://www.payhere.lk" target="_blank" rel="noopener noreferrer" className="font-bold underline text-blue-600 dark:text-blue-400">https://www.payhere.lk</a> or check the receipt link in your email payment confirmation.</p>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Contact Support</h2>
                <p>
                  For any questions regarding cancellations or refunds, our support team is available to assist you:
                </p>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200">
                  CV PILOT Support Team<br />
                  Email: <a href="mailto:cvpilot.site.je@gmail.com" className="text-blue-600 dark:text-blue-400 underline">cvpilot.site.je@gmail.com</a><br />
                  Website: <a href="https://cvpilot.space" className="text-blue-600 dark:text-blue-400 underline">https://cvpilot.space</a>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
