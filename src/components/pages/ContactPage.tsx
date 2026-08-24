import React, { useState } from 'react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';

interface ContactPageProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  onNavigateBuilder: () => void;
  onNavigatePricing?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigateHome,
  onNavigateDashboard,
  onNavigateBuilder,
  onNavigatePricing,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('https://formsubmit.co/ajax/cvpilot.site.je@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _subject: `[CV PILOT] ${formData.subject} - ${formData.name}`,
          _template: 'table',
          _captcha: 'false',
          subject_category: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();
      if (response.ok || data.success === 'true' || data.success === true) {
        setFormSubmitted(true);
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      } else {
        throw new Error(data.message || 'Unable to deliver message right now.');
      }
    } catch (err: any) {
      console.warn('FormSubmit endpoint error or blocked, triggering fallback:', err);
      // Fallback: Open native mail client addressed to cvpilot.site.je@gmail.com
      const mailtoUrl = `mailto:cvpilot.site.je@gmail.com?subject=${encodeURIComponent(
        `[CV PILOT] ${formData.subject} - ${formData.name}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`
      )}`;
      window.location.href = mailtoUrl;
      setFormSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans transition-colors duration-300">
      <Navbar 
        onDashboardClick={onNavigateDashboard}
        onBuildResumeClick={onNavigateBuilder}
        onHomeClick={onNavigateHome}
        onPricingClick={onNavigatePricing}
      />

      <main className="w-full flex-grow py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-10">
          
          {/* Breadcrumb Navigation */}
          <div>
            <button 
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-wider cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Home
            </button>
          </div>

          {/* Hero Header Section */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Contact Us
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Have questions about <span className="font-bold text-amber-600 dark:text-amber-400">CV PILOT</span>, need assistance with your Pro account, or want to collaborate? Reach out through any of our official channels below.
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Phone & WhatsApp */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:border-amber-500 dark:hover:border-amber-500 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">call</span>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Contact Number
                </h3>
                <p className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                  +94 72 286 7166
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Available for Calls & WhatsApp messages.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a 
                  href="tel:+94722867166"
                  className="flex-1 text-center py-2 px-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-lg hover:opacity-90 transition-opacity"
                >
                  Call Now
                </a>
                <button
                  onClick={() => handleCopy('+94 72 286 7166', 'phone')}
                  className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Copy Phone Number"
                >
                  <span className="material-symbols-outlined text-base">
                    {copiedField === 'phone' ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>

            {/* Support Email */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:border-amber-500 dark:hover:border-amber-500 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">mail</span>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Support Email
                </h3>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white font-mono break-all">
                  cvpilot.site.je@gmail.com
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  For account help, billing, & general inquiries.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a 
                  href="mailto:cvpilot.site.je@gmail.com"
                  className="flex-1 text-center py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors"
                >
                  Send Email
                </a>
                <button
                  onClick={() => handleCopy('cvpilot.site.je@gmail.com', 'support_email')}
                  className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Copy Support Email"
                >
                  <span className="material-symbols-outlined text-base">
                    {copiedField === 'support_email' ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>

            {/* Personal Email */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:border-amber-500 dark:hover:border-amber-500 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">person_pin</span>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Personal Mail
                </h3>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white font-mono break-all">
                  himathdezilva@gmail.com
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Direct developer & founder contact line.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a 
                  href="mailto:himathdezilva@gmail.com"
                  className="flex-1 text-center py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition-colors"
                >
                  Direct Mail
                </a>
                <button
                  onClick={() => handleCopy('himathdezilva@gmail.com', 'personal_email')}
                  className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Copy Personal Email"
                >
                  <span className="material-symbols-outlined text-base">
                    {copiedField === 'personal_email' ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>

            {/* Official Website */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:border-amber-500 dark:hover:border-amber-500 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">language</span>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Official Website
                </h3>
                <p className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                  ladduwa.gt.tc
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Visit developer portal & web ecosystem.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a 
                  href="http://ladduwa.gt.tc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <span>Visit</span>
                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                </a>
                <button
                  onClick={() => handleCopy('ladduwa.gt.tc', 'website')}
                  className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Copy Website URL"
                >
                  <span className="material-symbols-outlined text-base">
                    {copiedField === 'website' ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>

          </div>

          {/* Interactive Form & Info Card Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
            
            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500">send</span>
                  Send Us a Direct Message
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Fill out the form below and we will get back to you within 24 business hours.
                </p>
              </div>

              {formSubmitted ? (
                <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                    ✓
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                    Message Sent to Support!
                  </h3>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                    Your details and message have been sent to <strong className="font-mono text-emerald-900 dark:text-emerald-100">cvpilot.site.je@gmail.com</strong>. Our support team will reply to your email address shortly.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="mt-2 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 transition-colors uppercase tracking-wider"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Your Name
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Your Email
                      </label>
                      <input 
                        type="email" 
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="General Support & Inquiry">General Support & Inquiry</option>
                      <option value="Pro Membership Assistance">Pro Membership Assistance</option>
                      <option value="Resume Builder Feedback">Resume Builder Feedback</option>
                      <option value="Business & Partnership">Business & Partnership</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Message
                    </label>
                    <textarea 
                      rows={5}
                      required
                      placeholder="How can we help you build your perfect CV today?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {submitError && (
                    <p className="text-xs text-rose-500 font-semibold">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-600 disabled:opacity-50 text-white dark:text-slate-950 font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                        Sending to cvpilot.site.je@gmail.com...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">send</span>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Quick Support FAQ Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500">help_outline</span>
                  Frequently Asked Questions
                </h3>

                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
                    <p className="font-bold text-slate-900 dark:text-white mb-1">
                      How quickly do you reply to emails?
                    </p>
                    <p>
                      We typically respond within 2 to 12 hours on business days.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
                    <p className="font-bold text-slate-900 dark:text-white mb-1">
                      Can I get phone support for Pro Membership?
                    </p>
                    <p>
                      Yes! You can call or message us directly at <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">+94 72 286 7166</span>.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
                    <p className="font-bold text-slate-900 dark:text-white mb-1">
                      Need custom CV design services?
                    </p>
                    <p>
                      Contact our personal developer mail at <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">himathdezilva@gmail.com</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs space-y-2">
                <p className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  Support Hours
                </p>
                <p className="text-amber-900 dark:text-amber-200">
                  Monday – Sunday: 8:00 AM – 10:00 PM (IST / Sri Lanka Standard Time)
                </p>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
