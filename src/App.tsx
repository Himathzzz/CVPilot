import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MembershipProvider } from './context/MembershipContext';
import { ThemeProvider } from './context/ThemeContext';
import { ResumeProvider } from './context/ResumeContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AIFeaturesSection } from './components/AIFeaturesSection';
import { TemplateShowcaseSection } from './components/TemplateShowcaseSection';
import { ProcessSection } from './components/ProcessSection';
import { SuccessStories } from './components/SuccessStories';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { UpgradeModal } from './components/UpgradeModal';
import { PricingSection } from './components/PricingSection';
import { ResumeBuilderPlaceholder } from './components/ResumeBuilderPlaceholder';
import { DashboardScreen } from './components/DashboardScreen';
import { PricingPage } from './components/pages/PricingPage';
import { TermsPage } from './components/pages/TermsPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { RefundPage } from './components/pages/RefundPage';
import { ContactPage } from './components/pages/ContactPage';
import { AIChatResumeBuilder } from './components/AIChatResumeBuilder';
import type { ResumeTemplateId } from './types/resume';

type ViewMode = 'home' | 'dashboard' | 'builder' | 'chat' | 'pricing' | 'terms' | 'privacy' | 'refunds' | 'contact';

const getPathView = (pathname: string): ViewMode => {
  const cleanPath = pathname.toLowerCase().replace(/\/$/, '');
  if (cleanPath === '/pricing' || cleanPath === '/price') return 'pricing';
  if (cleanPath === '/terms' || cleanPath === '/terms-of-service' || cleanPath === '/terms-and-conditions' || cleanPath === '/tos') return 'terms';
  if (cleanPath === '/privacy' || cleanPath === '/privacy-policy') return 'privacy';
  if (cleanPath === '/refunds' || cleanPath === '/refund-policy' || cleanPath === '/refund' || cleanPath === '/return-policy' || cleanPath === '/returns') return 'refunds';
  if (cleanPath === '/contact' || cleanPath === '/contact-us' || cleanPath === '/support') return 'contact';
  if (cleanPath === '/dashboard' || cleanPath === '/settings') return 'dashboard';
  if (cleanPath === '/builder') return 'builder';
  if (cleanPath === '/chat' || cleanPath === '/ai-chat' || cleanPath === '/ai') return 'chat';
  return 'home';
};

const MainContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(() => getPathView(window.location.pathname));
  const { user, openAuthModal } = useAuth();

  const navigateTo = (view: ViewMode, path: string) => {
    setCurrentView(view);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  };

  // Sync state with popstate (back/forward buttons or pushState calls)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getPathView(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Reset protected views to home if user logs out
  useEffect(() => {
    if (!user && (currentView === 'dashboard' || currentView === 'builder' || currentView === 'chat')) {
      navigateTo('home', '/');
    }
  }, [user, currentView]);

  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplateId>('modern');

  const handleDashboardClick = () => {
    if (user) {
      navigateTo('dashboard', '/dashboard');
    } else {
      openAuthModal();
    }
  };

  const handleBuildResumeClick = () => {
    if (user) {
      navigateTo('builder', '/builder');
    } else {
      openAuthModal();
    }
  };

  const handleAIChatClick = () => {
    if (user) {
      navigateTo('chat', '/chat');
    } else {
      openAuthModal();
    }
  };

  const handleSelectTemplateFromGallery = (templateId: ResumeTemplateId) => {
    setSelectedTemplate(templateId);
    if (user) {
      navigateTo('builder', '/builder');
    } else {
      openAuthModal();
    }
  };

  const handleNavigateToBuilder = (templateId?: ResumeTemplateId) => {
    if (templateId) {
      setSelectedTemplate(templateId);
    }
    navigateTo('builder', '/builder');
  };

  const handleNavigateToHome = () => {
    navigateTo('home', '/');
  };

  const handleFooterNavigate = (path: string) => {
    const view = getPathView(path);
    navigateTo(view, path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'chat' && user) {
    return (
      <>
        <AIChatResumeBuilder
          onBackToHome={() => navigateTo('dashboard', '/dashboard')}
          onNavigateToBuilder={handleNavigateToBuilder}
        />
        <AuthModal />
        <UpgradeModal />
      </>
    );
  }

  if (currentView === 'pricing') {
    return (
      <>
        <PricingPage 
          onNavigateHome={handleNavigateToHome}
          onNavigateDashboard={handleDashboardClick}
          onNavigateBuilder={handleBuildResumeClick}
        />
        <AuthModal />
        <UpgradeModal />
      </>
    );
  }

  if (currentView === 'terms') {
    return (
      <>
        <TermsPage 
          onNavigateHome={handleNavigateToHome}
          onNavigateDashboard={handleDashboardClick}
          onNavigateBuilder={handleBuildResumeClick}
        />
        <AuthModal />
        <UpgradeModal />
      </>
    );
  }

  if (currentView === 'privacy') {
    return (
      <>
        <PrivacyPage 
          onNavigateHome={handleNavigateToHome}
          onNavigateDashboard={handleDashboardClick}
          onNavigateBuilder={handleBuildResumeClick}
        />
        <AuthModal />
        <UpgradeModal />
      </>
    );
  }

  if (currentView === 'refunds') {
    return (
      <>
        <RefundPage 
          onNavigateHome={handleNavigateToHome}
          onNavigateDashboard={handleDashboardClick}
          onNavigateBuilder={handleBuildResumeClick}
        />
        <AuthModal />
        <UpgradeModal />
      </>
    );
  }

  if (currentView === 'contact') {
    return (
      <>
        <ContactPage 
          onNavigateHome={handleNavigateToHome}
          onNavigateDashboard={handleDashboardClick}
          onNavigateBuilder={handleBuildResumeClick}
          onNavigatePricing={() => navigateTo('pricing', '/pricing')}
        />
        <AuthModal />
        <UpgradeModal />
      </>
    );
  }

  if (currentView === 'dashboard' && user) {
    return (
      <>
        <DashboardScreen 
          onNavigateToBuilder={handleNavigateToBuilder}
          onNavigateToHome={handleNavigateToHome}
          onNavigateToAIChat={handleAIChatClick}
        />
        <AuthModal />
        <UpgradeModal />
      </>
    );
  }

  if (currentView === 'builder' && user) {
    return (
      <>
        <ResumeBuilderPlaceholder 
          initialTemplate={selectedTemplate}
          onBackToHome={() => navigateTo('dashboard', '/dashboard')} 
          onNavigateToAIChat={handleAIChatClick}
        />
        <AuthModal />
        <UpgradeModal />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans transition-colors duration-300">
      <Navbar 
        onDashboardClick={handleDashboardClick}
        onBuildResumeClick={handleBuildResumeClick}
        onAIChatClick={handleAIChatClick}
        onHomeClick={handleNavigateToHome}
        onPricingClick={() => navigateTo('pricing', '/pricing')}
      />
      <main className="w-full flex-grow">
        <HeroSection 
          onBuildResumeClick={handleBuildResumeClick} 
          onAIChatClick={handleAIChatClick}
        />
        <AIFeaturesSection />
        <TemplateShowcaseSection onSelectTemplate={handleSelectTemplateFromGallery} />
        <div id="process">
          <ProcessSection />
        </div>
        <PricingSection />
        <SuccessStories />
      </main>
      <Footer onNavigate={handleFooterNavigate} />
      <AuthModal />
      <UpgradeModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MembershipProvider>
          <ResumeProvider>
            <MainContent />
          </ResumeProvider>
        </MembershipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

