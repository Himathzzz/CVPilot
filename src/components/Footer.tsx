import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-xl bg-white border-t border-outline-variant font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
        <div className="flex items-center gap-3 mb-md md:mb-0">
          <img src="/logo.png" alt="CV PILOT Logo" className="h-8 w-auto object-contain" />
          <div className="flex flex-col">
            <span className="font-display text-body-lg font-bold text-navy uppercase tracking-wider leading-none">
              CV PILOT
            </span>
            <span className="text-[8px] font-medium text-gold tracking-widest uppercase mt-0.5">
              Crafting Resumes. Building Futures.
            </span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-lg font-caption text-caption text-navy font-medium mb-md md:mb-0">
          <a className="hover:text-gold transition-all" href="#privacy">Privacy Policy</a>
          <a className="hover:text-gold transition-all" href="#terms">Terms of Service</a>
          <a className="hover:text-gold transition-all" href="#cookies">Cookie Policy</a>
          <a className="hover:text-gold transition-all" href="#contact">Contact Us</a>
        </div>
        <div className="font-caption text-caption text-navy font-medium">
          © 2026 CV PILOT. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
