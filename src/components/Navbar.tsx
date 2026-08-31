import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useMembership } from '../context/MembershipContext';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onDashboardClick: () => void;
  onBuildResumeClick: () => void;
  onHomeClick: () => void;
  onAIChatClick?: () => void;
  onPricingClick?: () => void;
  onContactClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onDashboardClick, 
  onBuildResumeClick, 
  onHomeClick, 
  onAIChatClick, 
  onPricingClick, 
  onContactClick 
}) => {
  const { user, openAuthModal, logout } = useAuth();
  const { isProMember, downgradeToFree, openUpgradeModal } = useMembership();
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleCancelMembership = async () => {
    if (window.confirm('Are you sure you want to cancel your Pro Membership? You will lose access to 100+ Pro templates and AI features.')) {
      await downgradeToFree();
      setShowUserDropdown(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (user) {
      onDashboardClick();
    } else {
      openAuthModal();
    }
  };

  const handleAIChatNav = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (user) {
      if (onAIChatClick) onAIChatClick();
      else {
        window.history.pushState({}, '', '/chat');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    } else {
      openAuthModal();
    }
  };

  const handlePricingNav = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onPricingClick) {
      onPricingClick();
    }
  };

  const handleContactNav = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onContactClick) {
      onContactClick();
    } else {
      window.history.pushState({}, '', '/contact');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleBuildClick = () => {
    setIsMobileMenuOpen(false);
    if (user) {
      onDashboardClick();
    } else {
      openAuthModal();
    }
  };

  return (
    <nav className="w-full top-0 sticky z-50 bg-white dark:bg-slate-900 border-b border-outline-variant dark:border-slate-800 shadow-xs transition-colors duration-300">
      <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
        {/* Brand Logo & Title */}
        <div 
          onClick={() => {
            setIsMobileMenuOpen(false);
            onHomeClick();
          }}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img 
            src="/logo.png" 
            alt="CV PILOT Logo" 
            className="h-10 sm:h-12 w-auto object-contain"
          />
          <div className="flex flex-col">
            <span className="font-display text-lg sm:text-xl font-bold text-navy dark:text-white tracking-wider uppercase leading-none">
              CV PILOT
            </span>
            <span className="text-[8px] sm:text-[9px] font-medium text-gold tracking-widest uppercase mt-1">
              Crafting Resumes. Building Futures.
            </span>
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-lg font-sans text-body-md font-medium text-navy dark:text-slate-200">
          <a 
            onClick={handleDashboardClick}
            className="text-navy dark:text-slate-200 hover:text-gold dark:hover:text-gold transition-colors cursor-pointer" 
            href="#dashboard"
          >
            Dashboard
          </a>
          <a 
            onClick={handleAIChatNav}
            className="text-navy dark:text-slate-200 hover:text-gold dark:hover:text-gold transition-colors cursor-pointer flex items-center gap-1.5" 
            href="/chat"
          >
            <span className="material-symbols-outlined text-[18px] text-gold animate-pulse">smart_toy</span>
            AI Chat Builder
            <span className="text-[9px] bg-gold/20 text-gold font-extrabold px-1.5 py-0.2 rounded uppercase">
              AI
            </span>
          </a>
          <a 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-navy dark:text-slate-200 hover:text-gold dark:hover:text-gold transition-colors" 
            href="#templates"
          >
            Templates
          </a>
          <a 
            onClick={handlePricingNav}
            className="text-navy dark:text-slate-200 hover:text-gold dark:hover:text-gold transition-colors cursor-pointer" 
            href="/pricing"
          >
            Pricing
          </a>
          <a 
            onClick={handleContactNav}
            className="text-navy dark:text-slate-200 hover:text-gold dark:hover:text-gold transition-colors cursor-pointer" 
            href="/contact"
          >
            Support
          </a>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2 sm:gap-md relative">
          <ThemeToggle />

          <button 
            onClick={handleBuildClick}
            className="hidden sm:inline-flex bg-gold hover:bg-[#b89355] text-navy font-bold px-4 md:px-lg py-2.5 rounded shadow-sm border border-gold hover:shadow-md transition-all uppercase tracking-wider text-xs cursor-pointer"
          >
            Build Resume
          </button>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="text-navy dark:text-white flex items-center gap-1.5 hover:scale-95 transition-transform border border-gold p-1.5 bg-surface-container-low dark:bg-slate-800 rounded cursor-pointer" 
                aria-label="Account"
              >
                <span className="material-symbols-outlined text-gold">account_circle</span>
                {isProMember && (
                  <span className="bg-emerald-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                    PRO
                  </span>
                )}
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-xs w-52 bg-white dark:bg-slate-800 border border-outline-variant dark:border-slate-700 shadow-xl z-50 p-sm flex flex-col gap-xs rounded">
                  <div className="font-label-caps text-label-caps text-navy dark:text-white font-medium truncate border-b border-outline-variant dark:border-slate-700 pb-xs">
                    {user.displayName || 'Pilot User'}
                  </div>
                  <div className="font-caption text-caption text-navy dark:text-slate-300 truncate opacity-80">
                    {user.email}
                  </div>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onDashboardClick();
                    }}
                    className="text-left py-xs text-xs font-label-caps uppercase text-navy dark:text-slate-200 font-medium hover:text-gold transition-colors mt-xs"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={(e) => {
                      setShowUserDropdown(false);
                      handleAIChatNav(e);
                    }}
                    className="text-left py-xs text-xs font-label-caps uppercase text-gold font-bold hover:underline transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">smart_toy</span>
                    AI Chat Builder
                  </button>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onBuildResumeClick();
                    }}
                    className="text-left py-xs text-xs font-label-caps uppercase text-navy dark:text-slate-200 font-medium hover:text-gold transition-colors"
                  >
                    Resume Builder
                  </button>

                  {isProMember ? (
                    <button
                      onClick={handleCancelMembership}
                      className="text-left py-xs text-[11px] font-bold uppercase text-rose-600 dark:text-rose-400 hover:underline transition-colors flex items-center gap-1 border-t border-slate-100 dark:border-slate-700 pt-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">cancel</span>
                      Cancel Pro Membership
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        openUpgradeModal();
                      }}
                      className="text-left py-xs text-[11px] font-extrabold uppercase text-blue-600 dark:text-blue-400 hover:underline transition-colors flex items-center gap-1 border-t border-slate-100 dark:border-slate-700 pt-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">workspace_premium</span>
                      Upgrade to Pro ($5/mo)
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                    }}
                    className="text-left py-xs text-xs font-label-caps uppercase text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors border-t border-outline-variant dark:border-slate-700 pt-xs font-medium"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={openAuthModal}
              className="text-navy dark:text-white hover:text-gold flex items-center hover:scale-95 transition-transform p-1" 
              aria-label="Account"
            >
              <span className="material-symbols-outlined text-[28px] text-navy dark:text-white">account_circle</span>
            </button>
          )}

          {/* Hamburger Menu Toggle (Mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-navy dark:text-white p-2 flex items-center justify-center hover:text-gold transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-outline-variant dark:border-slate-800 px-6 py-4 flex flex-col gap-4 shadow-lg animate-fade-in">
          <a 
            onClick={handleDashboardClick}
            className="text-navy dark:text-slate-200 hover:text-gold font-medium text-base py-1 border-b border-slate-100 dark:border-slate-800" 
            href="#dashboard"
          >
            Dashboard
          </a>
          <a 
            onClick={handleAIChatNav}
            className="text-gold font-bold text-base py-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2" 
            href="/chat"
          >
            <span className="material-symbols-outlined text-lg">smart_toy</span>
            AI Chat Builder (ChatGPT)
          </a>
          <a 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-navy dark:text-slate-200 hover:text-gold font-medium text-base py-1 border-b border-slate-100 dark:border-slate-800" 
            href="#templates"
          >
            Templates
          </a>
          <a 
            onClick={handlePricingNav}
            className="text-navy dark:text-slate-200 hover:text-gold font-medium text-base py-1 border-b border-slate-100 dark:border-slate-800" 
            href="/pricing"
          >
            Pricing
          </a>
          <a 
            onClick={handleContactNav}
            className="text-navy dark:text-slate-200 hover:text-gold font-medium text-base py-1 border-b border-slate-100 dark:border-slate-800" 
            href="/contact"
          >
            Support & Contact
          </a>
          <button 
            onClick={handleBuildClick}
            className="w-full bg-gold hover:bg-[#b89355] text-navy font-bold py-3 rounded shadow-sm border border-gold uppercase tracking-wider text-xs cursor-pointer mt-2"
          >
            Build Resume Now
          </button>
        </div>
      )}
    </nav>
  );
};
