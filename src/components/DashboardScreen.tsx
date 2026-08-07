import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface DashboardScreenProps {
  onNavigateToBuilder: () => void;
  onNavigateToHome: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigateToBuilder, onNavigateToHome }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'resumes' | 'builder' | 'templates' | 'analytics' | 'settings'>('resumes');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  const handleTabClick = (tab: 'resumes' | 'builder' | 'templates' | 'analytics' | 'settings') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    if (tab === 'builder') {
      onNavigateToBuilder();
    }
  };

  return (
    <div className="flex h-full min-h-screen bg-background text-navy font-sans selection:bg-gold selection:text-white">
      {/* SideNavBar (Desktop & Mobile Drawer) */}
      <nav className={`bg-white text-navy font-sans text-body-md h-screen w-64 fixed left-0 top-0 border-r border-outline-variant flex flex-col p-md gap-sm z-40 transition-transform duration-300 shadow-sm ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="mb-lg flex justify-between items-center pb-sm border-b border-outline-variant">
          <button 
            onClick={onNavigateToHome} 
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left"
          >
            <img src="/logo.png" alt="CV PILOT Logo" className="h-10 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="font-display text-base font-bold text-navy tracking-wider uppercase leading-none">
                CV PILOT
              </span>
              <span className="text-[8px] font-semibold text-gold tracking-widest uppercase mt-0.5">
                CRAFTING RESUMES
              </span>
            </div>
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="md:hidden text-navy p-1"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 space-y-unit">
          <button 
            onClick={() => handleTabClick('resumes')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all text-left text-sm ${
              activeTab === 'resumes' ? 'bg-navy text-white shadow-xs' : 'text-navy hover:bg-surface-container-low hover:text-gold'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">description</span>
            My Resumes
          </button>
          <button 
            onClick={() => handleTabClick('builder')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all text-left text-sm ${
              activeTab === 'builder' ? 'bg-navy text-white shadow-xs' : 'text-navy hover:bg-surface-container-low hover:text-gold'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">edit_note</span>
            Builder
          </button>
          <button 
            onClick={() => handleTabClick('templates')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all text-left text-sm ${
              activeTab === 'templates' ? 'bg-navy text-white shadow-xs' : 'text-navy hover:bg-surface-container-low hover:text-gold'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">dashboard_customize</span>
            Templates
          </button>
          <button 
            onClick={() => handleTabClick('analytics')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all text-left text-sm ${
              activeTab === 'analytics' ? 'bg-navy text-white shadow-xs' : 'text-navy hover:bg-surface-container-low hover:text-gold'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">bar_chart</span>
            Analytics
          </button>
          <button 
            onClick={() => handleTabClick('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all text-left text-sm ${
              activeTab === 'settings' ? 'bg-navy text-white shadow-xs' : 'text-navy hover:bg-surface-container-low hover:text-gold'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            Settings
          </button>
        </div>

        <div className="mt-auto border-t border-outline-variant pt-md space-y-md">
          <div className="flex items-center gap-3 p-2 bg-surface-container-low rounded border border-outline-variant">
            <div className="w-9 h-9 rounded bg-gold/20 flex items-center justify-center text-gold font-bold text-sm">
              CP
            </div>
            <div className="overflow-hidden">
              <p className="font-sans text-xs font-semibold text-navy leading-tight truncate">Professional Plan</p>
              <p className="font-caption text-caption text-gold font-medium">60% complete</p>
            </div>
          </div>
          <button className="w-full bg-gold hover:bg-[#8e6f3d] text-navy font-medium font-label-caps text-label-caps uppercase py-2.5 rounded flex items-center justify-center gap-2 transition-colors shadow-xs">
            Upgrade to Pro
          </button>
          <div className="space-y-unit pt-sm border-t border-outline-variant">
            <a href="#help" className="flex items-center gap-3 px-3 py-2 text-navy hover:text-gold transition-all rounded-lg font-caption text-caption">
              <span className="material-symbols-outlined text-[18px]">help</span>
              Help
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
      <main className="flex-1 md:ml-64 bg-background min-h-screen overflow-auto">
        {/* Mobile Header */}
        <header className="md:hidden flex justify-between items-center h-16 px-margin-mobile border-b border-outline-variant bg-white sticky top-0 z-30">
          <div 
            onClick={onNavigateToHome}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src="/logo.png" alt="CV PILOT Logo" className="h-8 w-auto object-contain" />
            <span className="font-display text-lg font-bold text-navy uppercase tracking-wider">
              CV PILOT
            </span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-navy p-2"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl">
          {/* Welcome & Primary Action */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-end mb-xl gap-md">
            <div>
              <h1 className="font-display text-h1-mobile md:text-h1 font-bold text-navy mb-2">
                Welcome back, <span className="text-gold">{displayName}</span>.
              </h1>
              <p className="font-sans text-body-lg text-navy max-w-2xl opacity-90">
                Manage your active resumes and explore new templates to refine your professional narrative.
              </p>
            </div>
            <button 
              onClick={onNavigateToBuilder}
              className="bg-navy hover:bg-[#242f45] text-white font-medium font-label-caps text-label-caps px-6 py-3.5 rounded hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border border-navy"
            >
              <span className="material-symbols-outlined text-[18px] text-gold">add</span>
              CREATE NEW RESUME
            </button>
          </section>

          {/* Recent Resumes Bento Grid */}
          <section className="mb-xl">
            <div className="flex items-center justify-between mb-md border-b border-outline-variant pb-sm">
              <h2 className="font-label-caps text-label-caps uppercase text-navy font-semibold tracking-wider">
                Recent Resumes
              </h2>
              <button onClick={() => setActiveTab('resumes')} className="font-label-caps text-label-caps text-gold hover:underline font-medium">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {/* Card 1 */}
              <div 
                onClick={onNavigateToBuilder}
                className="border border-outline-variant bg-white hover:border-gold transition-all group cursor-pointer flex flex-col h-full rounded shadow-xs"
              >
                <div className="p-md flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-surface-container-low rounded border border-outline-variant">
                      <span className="material-symbols-outlined text-gold">work</span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-navy hover:text-gold" onClick={(e) => { e.stopPropagation(); onNavigateToBuilder(); }}>
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button className="text-navy hover:text-error" onClick={(e) => e.stopPropagation()}>
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </div>
                  <h3 className="font-display text-h2 text-navy font-semibold mb-1">Senior UX Designer Role</h3>
                  <p className="font-caption text-caption text-navy mb-4 opacity-80">Targeted for Tech Corp Inc.</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className="px-2 py-1 border border-outline-variant bg-surface-container-low rounded font-caption text-caption text-navy font-medium">Figma</span>
                    <span className="px-2 py-1 border border-outline-variant bg-surface-container-low rounded font-caption text-caption text-navy font-medium">Prototyping</span>
                  </div>
                </div>
                <div className="border-t border-outline-variant px-md py-sm bg-surface-container-low flex justify-between items-center">
                  <span className="font-caption text-caption text-navy opacity-80">Edited 2 hours ago</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-gold" title="Draft"></span>
                </div>
              </div>

              {/* Card 2 */}
              <div 
                onClick={onNavigateToBuilder}
                className="border border-outline-variant bg-white hover:border-gold transition-all group cursor-pointer flex flex-col h-full rounded shadow-xs"
              >
                <div className="p-md flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-surface-container-low rounded border border-outline-variant">
                      <span className="material-symbols-outlined text-gold">code</span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-navy hover:text-gold" onClick={(e) => { e.stopPropagation(); onNavigateToBuilder(); }}>
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button className="text-navy hover:text-error" onClick={(e) => e.stopPropagation()}>
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </div>
                  <h3 className="font-display text-h2 text-navy font-semibold mb-1">Frontend Engineer - Startup</h3>
                  <p className="font-caption text-caption text-navy mb-4 opacity-80">General application profile.</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className="px-2 py-1 border border-outline-variant bg-surface-container-low rounded font-caption text-caption text-navy font-medium">React</span>
                    <span className="px-2 py-1 border border-outline-variant bg-surface-container-low rounded font-caption text-caption text-navy font-medium">Tailwind</span>
                  </div>
                </div>
                <div className="border-t border-outline-variant px-md py-sm bg-surface-container-low flex justify-between items-center">
                  <span className="font-caption text-caption text-navy opacity-80">Edited 2 days ago</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" title="Published"></span>
                </div>
              </div>

              {/* New Empty State */}
              <div 
                onClick={onNavigateToBuilder}
                className="border border-gold border-dashed bg-surface-container-low hover:bg-white transition-all cursor-pointer flex flex-col items-center justify-center p-xl h-full text-center group min-h-[220px] rounded shadow-xs"
              >
                <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center bg-white mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-gold">add</span>
                </div>
                <h3 className="font-label-caps text-label-caps text-navy font-medium mb-2">Create New Resume</h3>
                <p className="font-caption text-caption text-navy opacity-80 max-w-[200px]">Start from scratch or import from LinkedIn.</p>
              </div>
            </div>
          </section>

          {/* Suggested Templates */}
          <section>
            <div className="flex items-center justify-between mb-md border-b border-outline-variant pb-sm">
              <h2 className="font-label-caps text-label-caps uppercase text-navy font-semibold tracking-wider">
                Suggested Templates
              </h2>
              <button onClick={() => setActiveTab('templates')} className="font-label-caps text-label-caps text-gold hover:underline font-medium">
                Browse Library
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
              {/* Template 1 */}
              <div className="group cursor-pointer" onClick={onNavigateToBuilder}>
                <div className="aspect-[1/1.4] border border-outline-variant bg-white mb-sm overflow-hidden relative rounded shadow-xs">
                  <img 
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                    alt="Template preview" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsSijevI8pmhHbJeY0mskuVFcB91NixuCYIZXbAWHDx6XOa3EVzyhkubwcNrGrynNtkDohf0FnfT32zSLVj7D0elhGF9A40ZgYAr0h_6fY9M8emOPdX95bZhMpJgY8EHu2tW0MehV23sDX2o9KXTdbE_6A6pUAaR99AhvlKLvggCyKTHBbonOvNGpoXRZO_xYY0gCVkv1w6WrUD5ZERgeZVPQKN10IPfo1l7P-lq2WBIGRAMH9-93I"
                  />
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-navy text-white px-4 py-2 font-label-caps text-label-caps font-medium rounded shadow-md border border-gold">
                      USE
                    </button>
                  </div>
                </div>
                <h4 className="font-sans text-body-md text-navy font-semibold">Minimalist Structural</h4>
                <p className="font-caption text-caption text-navy opacity-80">Tech / Design roles</p>
              </div>

              {/* Template 2 */}
              <div className="group cursor-pointer" onClick={onNavigateToBuilder}>
                <div className="aspect-[1/1.4] border border-outline-variant bg-white mb-sm overflow-hidden relative rounded shadow-xs">
                  <div className="w-full h-full bg-[radial-gradient(#A38048_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-navy text-white px-4 py-2 font-label-caps text-label-caps font-medium rounded shadow-md border border-gold">
                      USE
                    </button>
                  </div>
                  <div className="absolute inset-4 border border-gold border-dashed"></div>
                </div>
                <h4 className="font-sans text-body-md text-navy font-semibold">Grid Matrix</h4>
                <p className="font-caption text-caption text-navy opacity-80">Data / Engineering</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="w-full py-xl border-t border-outline-variant bg-white flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto mt-xl">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img src="/logo.png" alt="CV PILOT Logo" className="h-6 w-auto object-contain" />
            <span className="font-display text-body-lg font-bold text-navy tracking-wider uppercase">
              CV PILOT
            </span>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-lg font-caption text-caption text-navy opacity-80 justify-center mb-4 md:mb-0">
            <a className="hover:text-gold transition-all" href="#privacy">Privacy Policy</a>
            <a className="hover:text-gold transition-all" href="#terms">Terms of Service</a>
            <a className="hover:text-gold transition-all" href="#cookies">Cookie Policy</a>
            <a className="hover:text-gold transition-all" href="#contact">Contact Us</a>
          </div>
          <div className="font-caption text-caption text-navy opacity-80">
            © 2026 CV PILOT. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
};
