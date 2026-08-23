import React, { useState } from 'react';
import { LegalModal } from './LegalModal';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | 'refund' | null>(null);

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <>
      <footer className="w-full py-xl bg-white dark:bg-slate-900 border-t border-outline-variant dark:border-slate-800 font-sans transition-colors duration-300">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
          <div className="flex items-center gap-3 mb-md md:mb-0 cursor-pointer" onClick={(e) => handleLinkClick(e, '/')}>
            <img src="/logo.png" alt="CV PILOT Logo" className="h-8 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="font-display text-body-lg font-bold text-navy dark:text-white uppercase tracking-wider leading-none">
                CV PILOT
              </span>
              <span className="text-[8px] font-medium text-gold tracking-widest uppercase mt-0.5">
                Crafting Resumes. Building Futures.
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-lg font-caption text-caption text-navy dark:text-slate-300 font-medium mb-md md:mb-0">
            <a href="/pricing" onClick={(e) => handleLinkClick(e, '/pricing')} className="hover:text-gold transition-all">Pricing</a>
            <a href="/privacy" onClick={(e) => handleLinkClick(e, '/privacy')} className="hover:text-gold transition-all">Privacy Policy</a>
            <a href="/terms" onClick={(e) => handleLinkClick(e, '/terms')} className="hover:text-gold transition-all">Terms of Service</a>
            <a href="/refunds" onClick={(e) => handleLinkClick(e, '/refunds')} className="hover:text-gold transition-all">Return & Cancellation Policy</a>
            <a href="/contact" onClick={(e) => handleLinkClick(e, '/contact')} className="hover:text-gold transition-all">Contact Us</a>
          </div>
          <div className="font-caption text-caption text-navy dark:text-slate-400 font-medium">
            © 2026 CV PILOT. All rights reserved.
          </div>
        </div>
      </footer>
      <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />
    </>
  );
};

