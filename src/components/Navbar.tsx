import React from 'react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onDashboardClick: () => void;
  onBuildResumeClick: () => void;
  onHomeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onDashboardClick, onBuildResumeClick, onHomeClick }) => {
  const { user, openAuthModal, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      onDashboardClick();
    } else {
      openAuthModal();
    }
  };

  const handleBuildClick = () => {
    if (user) {
      onDashboardClick();
    } else {
      openAuthModal();
    }
  };

  return (
    <nav className="w-full top-0 sticky z-50 bg-white border-b border-outline-variant shadow-xs">
      <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
        {/* Brand Logo & Title */}
        <div 
          onClick={onHomeClick}
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img 
            src="/logo.png" 
            alt="CV PILOT Logo" 
            className="h-12 w-auto object-contain"
          />
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold text-navy tracking-wider uppercase leading-none">
              CV PILOT
            </span>
            <span className="text-[9px] font-medium text-gold tracking-widest uppercase mt-1">
              Crafting Resumes. Building Futures.
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-lg font-sans text-body-md font-medium text-navy">
          <a 
            onClick={handleDashboardClick}
            className="text-navy hover:text-gold transition-colors cursor-pointer" 
            href="#dashboard"
          >
            Dashboard
          </a>
          <a className="text-navy hover:text-gold transition-colors" href="#templates">
            Templates
          </a>
          <a className="text-navy hover:text-gold transition-colors" href="#pricing">
            Pricing
          </a>
          <a className="text-navy hover:text-gold transition-colors" href="#support">
            Support
          </a>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-md relative">
          <button 
            onClick={handleBuildClick}
            className="bg-gold hover:bg-[#b89355] text-navy font-medium px-lg py-2.5 rounded shadow-sm border border-gold hover:shadow-md transition-all uppercase tracking-wider text-xs"
          >
            Build Resume
          </button>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="text-navy flex items-center hover:scale-95 transition-transform border border-gold p-1.5 bg-surface-container-low rounded" 
                aria-label="Account"
              >
                <span className="material-symbols-outlined text-gold">account_circle</span>
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-xs w-52 bg-white border border-outline-variant shadow-xl z-50 p-sm flex flex-col gap-xs rounded">
                  <div className="font-label-caps text-label-caps text-navy font-medium truncate border-b border-outline-variant pb-xs">
                    {user.displayName || 'Pilot User'}
                  </div>
                  <div className="font-caption text-caption text-navy truncate opacity-80">
                    {user.email}
                  </div>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onDashboardClick();
                    }}
                    className="text-left py-xs text-xs font-label-caps uppercase text-navy font-medium hover:text-gold transition-colors mt-xs"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onBuildResumeClick();
                    }}
                    className="text-left py-xs text-xs font-label-caps uppercase text-navy font-medium hover:text-gold transition-colors"
                  >
                    Resume Builder
                  </button>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                    }}
                    className="text-left py-xs text-xs font-label-caps uppercase text-error hover:underline transition-colors border-t border-outline-variant pt-xs font-medium"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={openAuthModal}
              className="text-navy hover:text-gold flex items-center hover:scale-95 transition-transform p-1" 
              aria-label="Account"
            >
              <span className="material-symbols-outlined text-[28px] text-navy">account_circle</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
