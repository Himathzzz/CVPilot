import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProcessSection } from './components/ProcessSection';
import { SuccessStories } from './components/SuccessStories';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ResumeBuilderPlaceholder } from './components/ResumeBuilderPlaceholder';
import { DashboardScreen } from './components/DashboardScreen';

const MainContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'builder'>('home');
  const { user } = useAuth();

  // Reset to home if user logs out
  useEffect(() => {
    if (!user && currentView !== 'home') {
      setCurrentView('home');
    }
  }, [user, currentView]);

  const handleDashboardClick = () => {
    if (user) {
      setCurrentView('dashboard');
    }
  };

  const handleBuildResumeClick = () => {
    if (user) {
      setCurrentView('dashboard');
    }
  };

  const handleNavigateToBuilder = () => {
    setCurrentView('builder');
  };

  const handleNavigateToHome = () => {
    setCurrentView('home');
  };

  if (currentView === 'dashboard' && user) {
    return (
      <>
        <DashboardScreen 
          onNavigateToBuilder={handleNavigateToBuilder}
          onNavigateToHome={handleNavigateToHome}
        />
        <AuthModal />
      </>
    );
  }

  if (currentView === 'builder' && user) {
    return (
      <>
        <ResumeBuilderPlaceholder onBackToHome={() => setCurrentView('dashboard')} />
        <AuthModal />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background antialiased font-body-md text-body-md">
      <Navbar 
        onDashboardClick={handleDashboardClick}
        onBuildResumeClick={handleBuildResumeClick}
        onHomeClick={handleNavigateToHome}
      />
      <main className="w-full flex-grow">
        <HeroSection onBuildResumeClick={handleBuildResumeClick} />
        <div id="process">
          <ProcessSection />
        </div>
        <SuccessStories />
      </main>
      <Footer />
      <AuthModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
};

export default App;
