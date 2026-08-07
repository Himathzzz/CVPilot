import React from 'react';
import { useAuth } from '../context/AuthContext';

interface HeroSectionProps {
  onBuildResumeClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBuildResumeClick }) => {
  const { user, openAuthModal } = useAuth();

  const handleBuildClick = () => {
    if (user) {
      onBuildResumeClick();
    } else {
      openAuthModal();
    }
  };

  return (
    <section className="relative pt-20 pb-28 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto overflow-hidden">
      <div className="absolute inset-0 hero-pattern opacity-40 z-0"></div>
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
        <div className="col-span-1 md:col-span-8 md:col-start-3 text-center flex flex-col items-center gap-lg">
          <div className="inline-block px-md py-1 border border-gold bg-white text-gold text-xs font-medium uppercase tracking-widest rounded-full shadow-xs">
            Crafting Resumes. Building Futures.
          </div>
          <h1 className="font-display text-display md:text-[52px] font-bold text-navy tracking-tight leading-tight">
            Craft Your Perfect Resume with <span className="text-gold">AI Precision</span>
          </h1>
          <p className="font-sans text-body-lg text-navy max-w-2xl mx-auto leading-relaxed font-normal">
            A minimalist approach to career building. Construct a solid foundation for your professional history with our precision-engineered tools. Focus on data structure, not decoration.
          </p>
          <div className="flex flex-col sm:flex-row gap-md mt-sm w-full sm:w-auto">
            <button 
              onClick={handleBuildClick}
              className="bg-gold hover:bg-[#b89355] text-navy font-medium px-xl py-4 rounded text-xs uppercase tracking-wider hover:shadow-lg transition-all border border-gold shadow-sm"
            >
              Build Your Resume
            </button>
            <a 
              href="#process"
              className="bg-white border border-navy text-navy font-medium hover:bg-surface-container-low px-xl py-4 rounded text-xs uppercase tracking-wider transition-colors inline-block text-center shadow-xs"
            >
              View Process
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
