import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMembership } from '../context/MembershipContext';
import { useResumes } from '../context/ResumeContext';
import type { ResumeTemplateId } from '../types/resume';
import { TemplateLibraryModal } from './TemplateLibraryModal';
import { UpgradeModal } from './UpgradeModal';
import { ThemeToggle } from './ThemeToggle';

interface DashboardScreenProps {
  onNavigateToBuilder: (templateId?: ResumeTemplateId) => void;
  onNavigateToHome: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigateToBuilder, onNavigateToHome }) => {
  const { user, logout } = useAuth();
  const { isProMember, openUpgradeModal } = useMembership();
  const { resumes, createNewResume, selectActiveResume, deleteResume } = useResumes();
  const [activeTab, setActiveTab] = useState<'resumes' | 'builder' | 'templates' | 'analytics' | 'settings'>('resumes');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  const handleTabClick = (tab: 'resumes' | 'builder' | 'templates' | 'analytics' | 'settings') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    if (tab === 'builder') {
      onNavigateToBuilder();
    } else if (tab === 'templates') {
      setIsLibraryOpen(true);
    }
  };

  return (
    <div className="flex h-full min-h-screen bg-background dark:bg-slate-950 text-navy dark:text-slate-100 font-sans selection:bg-gold selection:text-white transition-colors duration-300">
      {/* SideNavBar (Desktop & Mobile Drawer) */}
      <nav className={`bg-white dark:bg-slate-900 text-navy dark:text-slate-100 font-sans text-body-md h-screen w-64 fixed left-0 top-0 border-r border-outline-variant dark:border-slate-800 flex flex-col p-md gap-sm z-40 transition-transform duration-300 shadow-sm ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="mb-lg flex justify-between items-center pb-sm border-b border-outline-variant dark:border-slate-800">
          <button 
            onClick={onNavigateToHome} 
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left"
          >
            <img src="/logo.png" alt="CV PILOT Logo" className="h-10 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="font-display text-base font-bold text-navy dark:text-white tracking-wider uppercase leading-none">
                CV PILOT
              </span>
              <span className="text-[8px] font-semibold text-gold tracking-widest uppercase mt-0.5">
                CRAFTING RESUMES
              </span>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <ThemeToggle className="md:hidden" />
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="md:hidden text-navy dark:text-white p-1"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-unit">
          <button 
            onClick={() => handleTabClick('resumes')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all text-left text-sm ${
              activeTab === 'resumes' ? 'bg-navy dark:bg-gold text-white dark:text-navy font-bold shadow-xs' : 'text-navy dark:text-slate-200 hover:bg-surface-container-low dark:hover:bg-slate-800 hover:text-gold'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">description</span>
            My Resumes
          </button>
          <button 
            onClick={() => handleTabClick('builder')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all text-left text-sm ${
              activeTab === 'builder' ? 'bg-navy dark:bg-gold text-white dark:text-navy font-bold shadow-xs' : 'text-navy dark:text-slate-200 hover:bg-surface-container-low dark:hover:bg-slate-800 hover:text-gold'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">edit_note</span>
            Builder
          </button>
          <button 
            onClick={() => handleTabClick('templates')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all text-left text-sm ${
              activeTab === 'templates' ? 'bg-navy dark:bg-gold text-white dark:text-navy font-bold shadow-xs' : 'text-navy dark:text-slate-200 hover:bg-surface-container-low dark:hover:bg-slate-800 hover:text-gold'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">dashboard_customize</span>
            Templates
          </button>
          <button 
            onClick={() => handleTabClick('analytics')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all text-left text-sm ${
              activeTab === 'analytics' ? 'bg-navy dark:bg-gold text-white dark:text-navy font-bold shadow-xs' : 'text-navy dark:text-slate-200 hover:bg-surface-container-low dark:hover:bg-slate-800 hover:text-gold'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">bar_chart</span>
            Analytics
          </button>
          <button 
            onClick={() => handleTabClick('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all text-left text-sm ${
              activeTab === 'settings' ? 'bg-navy dark:bg-gold text-white dark:text-navy font-bold shadow-xs' : 'text-navy dark:text-slate-200 hover:bg-surface-container-low dark:hover:bg-slate-800 hover:text-gold'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            Settings
          </button>
        </div>

        {/* Sidebar Theme Switcher & Pro Membership */}
        <div className="mt-auto border-t border-outline-variant dark:border-slate-800 pt-md space-y-md">
          <div className="flex items-center justify-between px-2 py-1 bg-surface-container-low dark:bg-slate-800/80 rounded border border-outline-variant dark:border-slate-700">
            <span className="text-xs font-semibold uppercase text-navy dark:text-slate-300">Theme</span>
            <ThemeToggle showLabel />
          </div>

          <div className="flex items-center gap-3 p-2 bg-surface-container-low dark:bg-slate-800 rounded border border-outline-variant dark:border-slate-700">
            <div className="w-9 h-9 rounded bg-gold/20 flex items-center justify-center text-gold font-bold text-sm">
              <span className="material-symbols-outlined text-lg">workspace_premium</span>
            </div>
            <div className="overflow-hidden">
              <p className="font-sans text-xs font-semibold text-navy dark:text-white leading-tight truncate">
                {isProMember ? 'PRO Member ($5/mo)' : 'Basic Free Plan'}
              </p>
              <p className="font-caption text-caption text-gold font-medium truncate">
                {isProMember ? 'Unlimited CVs • 100 Templates' : `${resumes.length} / 1 CV Created`}
              </p>
            </div>
          </div>
          {!isProMember ? (
            <button 
              onClick={openUpgradeModal}
              className="w-full bg-gold hover:bg-[#8e6f3d] text-navy font-bold font-label-caps text-xs uppercase py-2.5 rounded flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-base">workspace_premium</span>
              Upgrade to Pro ($5/mo)
            </button>
          ) : (
            <div className="w-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] uppercase py-2 rounded text-center border border-emerald-300 dark:border-emerald-800">
              ✓ Pro Active (Unlimited)
            </div>
          )}
          <div className="space-y-unit pt-sm border-t border-outline-variant dark:border-slate-800">
            <a 
              href="/contact" 
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/contact');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }} 
              className="flex items-center gap-3 px-3 py-2 text-navy dark:text-slate-300 hover:text-gold transition-all rounded-lg font-caption text-caption cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">help</span>
              Help & Support
            </a>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 text-error hover:underline transition-all rounded-lg font-caption text-caption text-left font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 bg-background dark:bg-slate-950 min-h-screen overflow-auto transition-colors duration-300">
        {/* Mobile Header */}
        <header className="md:hidden flex justify-between items-center h-16 px-margin-mobile border-b border-outline-variant dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30">
          <div 
            onClick={onNavigateToHome}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src="/logo.png" alt="CV PILOT Logo" className="h-8 w-auto object-contain" />
            <span className="font-display text-lg font-bold text-navy dark:text-white uppercase tracking-wider">
              CV PILOT
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-navy dark:text-white p-2"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </header>

        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl">
          {/* Welcome & Primary Action */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-end mb-xl gap-md">
            <div>
              <h1 className="font-display text-h1-mobile md:text-h1 font-bold text-navy dark:text-white mb-2">
                Welcome back, <span className="text-gold">{displayName}</span>.
              </h1>
              <p className="font-sans text-body-lg text-navy dark:text-slate-300 max-w-2xl opacity-90">
                Manage your active resumes and explore new templates to refine your professional narrative.
              </p>
            </div>
            <button 
              onClick={() => {
                const createdId = createNewResume();
                if (createdId) onNavigateToBuilder();
              }}
              className="bg-navy dark:bg-gold hover:bg-[#242f45] dark:hover:bg-[#8e6f3d] text-white dark:text-navy font-bold font-label-caps text-label-caps px-6 py-3.5 rounded hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border border-navy dark:border-gold"
            >
              <span className="material-symbols-outlined text-[18px] text-gold dark:text-navy">add</span>
              CREATE NEW RESUME
            </button>
          </section>

          {/* Recent Resumes Bento Grid */}
          <section className="mb-xl">
            <div className="flex items-center justify-between mb-md border-b border-outline-variant dark:border-slate-800 pb-sm">
              <h2 className="font-label-caps text-label-caps uppercase text-navy dark:text-slate-200 font-semibold tracking-wider">
                Recent Resumes ({resumes.length})
              </h2>
              <button onClick={() => setActiveTab('resumes')} className="font-label-caps text-label-caps text-gold hover:underline font-medium">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {resumes.map((res) => (
                <div 
                  key={res.id}
                  onClick={() => {
                    selectActiveResume(res.id);
                    onNavigateToBuilder(res.templateId);
                  }}
                  className="border border-outline-variant dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-gold dark:hover:border-gold transition-all group cursor-pointer flex flex-col h-full rounded shadow-xs"
                >
                  <div className="p-md flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-surface-container-low dark:bg-slate-800 rounded border border-outline-variant dark:border-slate-700">
                        <span className="material-symbols-outlined text-gold">
                          {res.data.personalInfo.jobTitle?.toLowerCase().includes('engineer') || res.data.personalInfo.jobTitle?.toLowerCase().includes('developer') ? 'code' : 'work'}
                        </span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="text-navy dark:text-slate-300 hover:text-emerald-500 p-1 flex items-center gap-1" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            selectActiveResume(res.id);
                            onNavigateToBuilder(res.templateId); 
                          }}
                          title="Download CV"
                        >
                          <span className="material-symbols-outlined text-[20px] text-emerald-600 dark:text-emerald-400">download</span>
                        </button>
                        <button 
                          className="text-navy dark:text-slate-300 hover:text-gold p-1" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            selectActiveResume(res.id);
                            onNavigateToBuilder(res.templateId); 
                          }}
                          title="Edit Resume"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button 
                          className="text-navy dark:text-slate-300 hover:text-error p-1" 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteResume(res.id);
                          }}
                          title="Delete Resume"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </div>
                    <h3 className="font-display text-h2 text-navy dark:text-white font-semibold mb-1 truncate">{res.title}</h3>
                    <p className="font-caption text-caption text-navy dark:text-slate-400 mb-4 opacity-80 truncate">
                      {res.data.personalInfo.jobTitle || 'Professional Resume'}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {res.data.skillCategories[0]?.skills.slice(0, 2).map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 border border-outline-variant dark:border-slate-700 bg-surface-container-low dark:bg-slate-800 rounded font-caption text-caption text-navy dark:text-slate-200 font-medium text-[11px]">
                          {skill}
                        </span>
                      )) || (
                        <span className="px-2 py-0.5 border border-outline-variant dark:border-slate-700 bg-surface-container-low dark:bg-slate-800 rounded font-caption text-caption text-navy dark:text-slate-200 font-medium text-[11px]">
                          {res.templateId}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-outline-variant dark:border-slate-800 px-md py-sm bg-surface-container-low dark:bg-slate-800/60 flex justify-between items-center">
                    <span className="font-caption text-caption text-navy dark:text-slate-400 opacity-80">
                      {!res.lastEdited || res.lastEdited === 'Just now' || res.lastEdited.includes('ago') 
                        ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : res.lastEdited}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectActiveResume(res.id);
                        onNavigateToBuilder(res.templateId);
                      }}
                      className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 uppercase"
                    >
                      <span className="material-symbols-outlined text-xs">download</span>
                      Download CV
                    </button>
                  </div>
                </div>
              ))}

              {/* Create New Resume Card */}
              <div 
                onClick={() => {
                  const createdId = createNewResume();
                  if (createdId) onNavigateToBuilder();
                }}
                className="border border-gold border-dashed bg-surface-container-low dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer flex flex-col items-center justify-center p-xl h-full text-center group min-h-[220px] rounded shadow-xs"
              >
                <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center bg-white dark:bg-slate-800 mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-gold">add</span>
                </div>
                <h3 className="font-label-caps text-label-caps text-navy dark:text-slate-200 font-medium mb-2">Create New Resume</h3>
                <p className="font-caption text-caption text-navy dark:text-slate-400 opacity-80 max-w-[200px]">Start from scratch or pick from 100+ templates.</p>
              </div>
            </div>
          </section>

          {/* Suggested Templates */}
          <section>
            <div className="flex items-center justify-between mb-md border-b border-outline-variant dark:border-slate-800 pb-sm">
              <h2 className="font-label-caps text-label-caps uppercase text-navy dark:text-slate-200 font-semibold tracking-wider">
                Suggested Templates
              </h2>
              <button onClick={() => setActiveTab('templates')} className="font-label-caps text-label-caps text-gold hover:underline font-medium">
                Browse Library
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
              {/* Template 1: Modern */}
              <div className="group cursor-pointer" onClick={() => onNavigateToBuilder('modern')}>
                <div className="aspect-[1/1.4] border border-outline-variant dark:border-slate-800 bg-white dark:bg-slate-900 mb-sm overflow-hidden relative rounded shadow-xs p-3 flex flex-col justify-between">
                  <div className="border-b border-gold pb-1">
                    <div className="w-12 h-2 bg-navy dark:bg-slate-200 rounded mb-1"></div>
                    <div className="w-8 h-1 bg-gold rounded"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full h-1 bg-gray-200 dark:bg-slate-700 rounded"></div>
                    <div className="w-3/4 h-1 bg-gray-200 dark:bg-slate-700 rounded"></div>
                  </div>
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 dark:group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-navy text-white px-3 py-1 text-xs font-bold rounded shadow-md border border-gold">
                      USE MODERN
                    </button>
                  </div>
                </div>
                <h4 className="font-sans text-xs text-navy dark:text-white font-bold">Modern Minimalist</h4>
                <p className="font-caption text-[11px] text-navy dark:text-slate-400 opacity-80">Clean & Gold Accents</p>
              </div>

              {/* Template 2: Executive */}
              <div className="group cursor-pointer" onClick={() => onNavigateToBuilder('executive')}>
                <div className="aspect-[1/1.4] border border-navy bg-navy mb-sm overflow-hidden relative rounded shadow-xs p-3 text-white flex flex-col justify-between">
                  <div className="border-b border-white/20 pb-2">
                    <div className="w-16 h-2 bg-gold rounded mb-1"></div>
                    <div className="w-10 h-1 bg-white/60 rounded"></div>
                  </div>
                  <div className="bg-white/10 p-1.5 rounded space-y-1">
                    <div className="w-full h-1 bg-white/40 rounded"></div>
                  </div>
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-colors flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-gold text-navy px-3 py-1 text-xs font-bold rounded shadow-md">
                      USE EXECUTIVE
                    </button>
                  </div>
                </div>
                <h4 className="font-sans text-xs text-navy dark:text-white font-bold">Executive Luxe</h4>
                <p className="font-caption text-[11px] text-navy dark:text-slate-400 opacity-80">Navy Header & Leadership</p>
              </div>

              {/* Template 3: Creative */}
              <div className="group cursor-pointer" onClick={() => onNavigateToBuilder('creative')}>
                <div className="aspect-[1/1.4] border border-outline-variant dark:border-slate-800 bg-white dark:bg-slate-900 mb-sm overflow-hidden relative rounded shadow-xs grid grid-cols-3">
                  <div className="bg-gray-900 p-2 flex flex-col justify-between">
                    <div className="w-4 h-4 rounded bg-gold"></div>
                    <div className="w-full h-1 bg-gray-600 rounded"></div>
                  </div>
                  <div className="col-span-2 p-2 space-y-2">
                    <div className="w-full h-1.5 bg-navy dark:bg-slate-300 rounded"></div>
                    <div className="w-3/4 h-1 bg-gray-300 dark:bg-slate-700 rounded"></div>
                  </div>
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 dark:group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-navy text-white px-3 py-1 text-xs font-bold rounded shadow-md border border-gold">
                      USE CREATIVE
                    </button>
                  </div>
                </div>
                <h4 className="font-sans text-xs text-navy dark:text-white font-bold">Creative Tech</h4>
                <p className="font-caption text-[11px] text-navy dark:text-slate-400 opacity-80">Dark Sidebar & Badges</p>
              </div>

              {/* Template 4: Compact */}
              <div className="group cursor-pointer" onClick={() => onNavigateToBuilder('compact')}>
                <div className="aspect-[1/1.4] border border-outline-variant dark:border-slate-800 bg-white dark:bg-slate-900 mb-sm overflow-hidden relative rounded shadow-xs p-2 space-y-1.5 text-center">
                  <div className="w-14 h-2 bg-gray-800 dark:bg-slate-300 mx-auto rounded"></div>
                  <div className="w-full h-[1px] bg-gray-400 dark:bg-slate-700"></div>
                  <div className="w-full h-1 bg-gray-200 dark:bg-slate-700 rounded"></div>
                  <div className="w-full h-1 bg-gray-200 dark:bg-slate-700 rounded"></div>
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 dark:group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-navy text-white px-3 py-1 text-xs font-bold rounded shadow-md border border-gold">
                      USE COMPACT
                    </button>
                  </div>
                </div>
                <h4 className="font-sans text-xs text-navy dark:text-white font-bold">Compact Professional</h4>
                <p className="font-caption text-[11px] text-navy dark:text-slate-400 opacity-80">Dense ATS Format</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="w-full py-xl border-t border-outline-variant dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto mt-xl transition-colors duration-300">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img src="/logo.png" alt="CV PILOT Logo" className="h-6 w-auto object-contain" />
            <span className="font-display text-body-lg font-bold text-navy dark:text-white tracking-wider uppercase">
              CV PILOT
            </span>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-lg font-caption text-caption text-navy dark:text-slate-300 opacity-80 justify-center mb-4 md:mb-0">
            <a className="hover:text-gold transition-all cursor-pointer" href="/privacy" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/privacy'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Privacy Policy</a>
            <a className="hover:text-gold transition-all cursor-pointer" href="/terms" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/terms'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Terms of Service</a>
            <a className="hover:text-gold transition-all cursor-pointer" href="/refunds" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/refunds'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Refund Policy</a>
            <a className="hover:text-gold transition-all cursor-pointer" href="/contact" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/contact'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Contact Us</a>
          </div>
          <div className="font-caption text-caption text-navy dark:text-slate-400 opacity-80">
            © 2026 CV PILOT. All rights reserved.
          </div>
        </footer>
      </main>

      {/* 100 Templates Library Modal */}
      <TemplateLibraryModal 
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectTemplateConfig={(config) => onNavigateToBuilder(config.id)}
      />

      {/* $5 Pro Upgrade Modal */}
      <UpgradeModal />
    </div>
  );
};
