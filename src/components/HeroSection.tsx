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
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 md:px-12 max-w-7xl mx-auto overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Text & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Create Your Professional Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500">in Minutes</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl font-normal leading-relaxed max-w-2xl">
            Resumaker-inspired AI builder that formats your experience, suggests high-impact bullet points, and guarantees 100% ATS parser compatibility.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button 
              onClick={handleBuildClick}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">bolt</span>
              Create My Resume Now
            </button>
            <a 
              href="#templates"
              className="px-8 py-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center shadow-xs flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">grid_view</span>
              View Templates
            </a>
          </div>

          {/* Quick Metrics Checklist */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
              Free ATS Checker
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
              No Design Skills Needed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
              Instant PDF Download
            </span>
          </div>
        </div>

        {/* Right Column Interactive Visual Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            {/* Top Bar Mockup Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">Live AI Preview</span>
            </div>

            {/* Resume Sheet Preview Lines */}
            <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-amber-500 flex items-center justify-center text-white font-bold text-lg">
                  JD
                </div>
                <div className="space-y-1 flex-grow">
                  <div className="h-4 bg-slate-800 dark:bg-slate-200 rounded w-2/3"></div>
                  <div className="h-3 bg-blue-600 dark:bg-blue-400 rounded w-1/2"></div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-4/5"></div>
              </div>
            </div>

            {/* Floating ATS Score Badge */}
            <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 border border-emerald-500/30 rounded-2xl p-3.5 shadow-xl flex items-center gap-3 animate-bounce-slow">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">ATS Score</div>
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">99 / 100</div>
              </div>
            </div>

            {/* Floating AI Suggestion Badge */}
            <div className="absolute -bottom-5 -left-5 bg-white dark:bg-slate-800 border border-blue-500/30 rounded-2xl p-3.5 shadow-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900 dark:text-white">AI Suggestion</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">Enhanced 3 action verbs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
