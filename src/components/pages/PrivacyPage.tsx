import React from 'react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';

interface PrivacyPageProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  onNavigateBuilder: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">shield</span>
                Data Protection & Privacy
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Last Updated: August 20, 2026 • Effective Date: August 20, 2026
              </p>
            </div>

            {/* Content Body */}
            <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Introduction</h2>
                <p>
                  At CV PILOT ("we", "our", or "us"), we are committed to safeguarding the privacy and security of our users' personal information. This Privacy Policy details how we collect, process, store, and protect your data when using <a href="https://cvpilot.space" className="text-blue-600 dark:text-blue-400 underline">https://cvpilot.space</a>.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Information We Collect</h2>
                <p>We collect only the necessary information required to provide our resume building and career optimization services:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> Email address, user name, and authentication details provided via Firebase Authentication or Google Sign-In.</li>
                  <li><strong>Resume Content:</strong> Employment history, education details, contact information, skills, and resume customization preferences created by you.</li>
                  <li><strong>Technical & Analytical Data:</strong> IP address, browser type, device details, and page navigation metrics used to maintain platform stability and performance.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Third-Party Payment Processing & Paddle</h2>
                <p>
                  We do not directly store or handle sensitive payment card numbers on our servers.
                </p>
                <p className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                  <strong>Paddle.com</strong> acts as our Merchant of Record for all order processing. All payment transactions are encrypted using 256-bit SSL protocol. Paddle collects billing addresses, transaction details, and payment credentials under their strict PCI-DSS Level 1 compliance standards. You may review Paddle’s privacy policy at <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">https://www.paddle.com/legal/privacy</a>.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. How We Use Your Data</h2>
                <p>Your data is used strictly for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Rendering and generating formatted ATS resume documents.</li>
                  <li>Providing AI text enhancement features tailored to your job descriptions.</li>
                  <li>Managing active user sessions, Pro subscriptions, and account authentication.</li>
                  <li>Sending critical service notifications and customer support responses.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Cookies & Local Storage</h2>
                <p>
                  We use essential local storage and cookie tokens solely for maintaining user authentication state, current theme settings (Light/Dark mode), and session security. We do not use third-party cross-site tracking cookies or sell user browsing habits.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">6. Data Ownership & Rights (GDPR / CCPA)</h2>
                <p>
                  Under European Union General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you possess the following rights:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Right to Access & Export:</strong> Download all your stored resume data at any time.</li>
                  <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request full deletion of your user account and resume records.</li>
                  <li><strong>Right to Rectification:</strong> Edit or update any personal data in real-time within your account dashboard.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">7. Data Security Measures</h2>
                <p>
                  All data in transit is protected using industry-standard TLS/SSL encryption. Resume data is securely backed up in enterprise cloud storage with strict access control policies.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">8. Privacy Enquiries & Support</h2>
                <p>
                  For any privacy inquiries, data deletion requests, or GDPR compliance requests, please email us at:
                </p>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200">
                  CV PILOT Privacy Officer<br />
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
