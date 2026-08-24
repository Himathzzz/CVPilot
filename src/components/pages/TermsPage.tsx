import React from 'react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';

interface TermsPageProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  onNavigateBuilder: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">gavel</span>
                Legal Agreement
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Terms of Service
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Last Updated: August 20, 2026 • Effective Date: August 20, 2026
              </p>
            </div>

            {/* Content Body */}
            <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
                <p>
                  By accessing, browsing, or using CV PILOT (accessible via <a href="https://cvpilot.space" className="text-blue-600 dark:text-blue-400 underline">https://cvpilot.space</a>), you acknowledge that you have read, understood, and agree to be legally bound by these Terms of Service ("Terms"). If you do not agree to all terms and conditions set forth herein, you are expressly prohibited from using our web application or services.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Description of Service</h2>
                <p>
                  CV PILOT is an AI-powered resume building platform offering automated ATS-formatting, customizable executive templates, professional bullet enhancement, and PDF document generation. The platform operates on a freemium model:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Basic Free Plan:</strong> Allows generation and storage of up to 1 CV document using standard templates.</li>
                  <li><strong>Pro Membership Subscription:</strong> Offers unlimited CV generation, access to 100+ executive templates, AI enhancement tools, multi-format exports, and premium theme customization for $5.00 USD (or equivalent local currency) per month.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Merchant of Record & Payment Processing</h2>
                <p>
                  Our order process and payment handling are conducted by our online reseller <strong>Paddle.com</strong>.
                </p>
                <p className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-800 text-xs leading-relaxed text-blue-900 dark:text-blue-200">
                  <strong>Paddle.com Market Ltd</strong> is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns. When purchasing a Pro Membership, you will provide payment information directly to Paddle, governed by Paddle’s Buyer Terms of Service and Privacy Policy.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Subscription Renewal & Billing</h2>
                <p>
                  Pro Membership subscriptions are billed on a monthly recurring schedule ($5.00/month or local equivalent). By subscribing, you authorize Paddle.com to charge your designated payment method on a recurring monthly basis until you cancel. You may cancel your subscription auto-renewal at any time through your account settings or by contacting our support team.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Refunds & Cancellation</h2>
                <p>
                  We stand behind our service quality with a <strong>7-Day Money-Back Guarantee</strong>. If you are unsatisfied with Pro Membership within 7 days of initial upgrade or renewal, you are entitled to a full refund. Please review our full <a href="/refunds" className="text-blue-600 dark:text-blue-400 font-semibold underline">Refund & Cancellation Policy</a> for details.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">6. User Content & Data Ownership</h2>
                <p>
                  You retain 100% intellectual property rights and full ownership of all text, resume content, job histories, and personal details submitted to CV PILOT. We do not claim ownership, sell, or rent your resume data to any third-party recruitment agencies or advertisers.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">7. Prohibited Conduct</h2>
                <p>
                  Users agree not to engage in any unlawful activities, attempt unauthorized access to platform infrastructure, reverse engineer the client code, or use automated systems to extract data from CV PILOT.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">8. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by applicable law, CV PILOT and its affiliates shall not be liable for any indirect, incidental, consequential, or punitive damages resulting from your use or inability to use the service.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">9. Contact Information</h2>
                <p>
                  If you have any questions regarding these Terms of Service, please contact us:
                </p>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200">
                  CV PILOT Legal Team<br />
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
