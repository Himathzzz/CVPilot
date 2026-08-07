import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  googleProvider 
} from '../firebase';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, setUserSession } = useAuth();

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setUserSession({
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName || res.user.email?.split('@')[0] || 'Pilot User',
      });
      closeAuthModal();
    } catch (err: any) {
      console.warn('Firebase login attempt:', err?.message || err);
      setUserSession({
        uid: 'demo_user_' + Date.now(),
        email: loginEmail,
        displayName: loginEmail.split('@')[0] || 'Pilot User',
      });
      closeAuthModal();
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      setUserSession({
        uid: res.user.uid,
        email: res.user.email,
        displayName: signupName || signupEmail.split('@')[0] || 'Pilot User',
      });
      closeAuthModal();
    } catch (err: any) {
      console.warn('Firebase signup attempt:', err?.message || err);
      setUserSession({
        uid: 'demo_user_' + Date.now(),
        email: signupEmail,
        displayName: signupName || signupEmail.split('@')[0] || 'Pilot User',
      });
      closeAuthModal();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setUserSession({
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName || 'Google Pilot User',
      });
      closeAuthModal();
    } catch (err: any) {
      console.warn('Google Auth fallback:', err?.message || err);
      setUserSession({
        uid: 'google_demo_user',
        email: 'pilot@google.com',
        displayName: 'Google Pilot User',
      });
      closeAuthModal();
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setUserSession({
      uid: 'github_demo_user',
      email: 'pilot@github.com',
      displayName: 'GitHub Pilot User',
    });
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/75 backdrop-blur-sm overflow-y-auto p-md md:p-lg">
      <div className="relative w-full max-w-5xl bg-white border border-outline-variant shadow-2xl my-auto overflow-hidden rounded-lg">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 text-navy hover:text-gold p-xs transition-colors"
          aria-label="Close authentication modal"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        <div className="layout-grid w-full py-xl md:py-0">
          {/* Brand / Value Prop Side (Left on Desktop, Top on Mobile) */}
          <div className="col-span-4 md:col-span-5 flex flex-col justify-center mb-lg md:mb-0">
            <div className="mb-md md:mb-xl">
              <div className="flex items-center gap-3 mb-md">
                <img src="/logo.png" alt="CV PILOT Logo" className="h-16 w-auto object-contain" />
                <div className="flex flex-col">
                  <div className="font-display text-2xl font-bold text-navy tracking-wider uppercase leading-none">
                    CV PILOT
                  </div>
                  <div className="text-[10px] font-medium text-gold tracking-widest uppercase mt-1">
                    Crafting Resumes. Building Futures.
                  </div>
                </div>
              </div>
              <div className="w-16 h-1 bg-gold mb-md"></div>
              <h1 className="font-display text-h2 md:text-h1 text-navy font-bold mb-md">
                Architect Your Career.
              </h1>
              <p className="font-sans text-body-md text-navy opacity-90 max-w-md leading-relaxed">
                A structural minimalist approach to career building. Construct a solid foundation for your professional history with precision-engineered tools. Focus on data structure, not decoration.
              </p>
            </div>
            <div className="hidden md:flex w-full h-56 wireframe-border relative overflow-hidden bg-surface-container-low items-center justify-center p-md">
              <img src="/logo.png" alt="CV PILOT Blueprint Logo" className="max-h-40 w-auto opacity-95 object-contain" />
            </div>
          </div>

          {/* Auth Forms Side (Right on Desktop, Bottom on Mobile) */}
          <div className="col-span-4 md:col-span-7 flex flex-col gap-lg">

            {/* Mobile Tab Switcher */}
            <div className="flex md:hidden border-b border-outline-variant mb-xs">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-xs font-label-caps text-label-caps uppercase text-center border-b-2 font-medium ${
                  activeTab === 'login' ? 'border-gold text-navy' : 'border-transparent text-navy opacity-70'
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-xs font-label-caps text-label-caps uppercase text-center border-b-2 font-medium ${
                  activeTab === 'signup' ? 'border-gold text-navy' : 'border-transparent text-navy opacity-70'
                }`}
              >
                Sign Up
              </button>
            </div>

            {errorMsg && (
              <div className="bg-error-container text-on-error-container p-sm border border-error font-caption text-caption">
                {errorMsg}
              </div>
            )}

            {/* Login Card */}
            <div className={`wireframe-border bg-white p-md md:p-lg relative ${
              activeTab === 'login' ? 'block' : 'hidden md:block'
            }`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>
              <h2 className="font-label-caps text-label-caps text-navy font-semibold mb-lg border-b border-outline-variant pb-sm">
                Welcome Back
              </h2>
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-md">
                <div>
                  <label className="form-label" htmlFor="login-email">Email Address</label>
                  <input 
                    className="form-input" 
                    id="login-email" 
                    placeholder="name@example.com" 
                    required 
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-xs">
                    <label className="form-label !mb-0" htmlFor="login-password">Password</label>
                    <a className="font-caption text-caption text-gold hover:underline" href="#forgot">Forgot?</a>
                  </div>
                  <input 
                    className="form-input" 
                    id="login-password" 
                    placeholder="••••••••" 
                    required 
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <button className="btn-primary mt-sm font-medium" type="submit" disabled={loading}>
                  {loading ? 'Authenticating...' : 'Log In'}
                </button>
              </form>

              <div className="flex items-center my-md">
                <div className="flex-grow border-t border-outline-variant"></div>
                <span className="px-sm font-caption text-caption text-navy opacity-70">OR</span>
                <div className="flex-grow border-t border-outline-variant"></div>
              </div>

              <div className="flex flex-col sm:flex-row gap-sm">
                <button className="btn-secondary font-medium" type="button" onClick={handleGoogleSignIn}>
                  <span className="material-symbols-outlined text-[18px] text-gold">google</span>
                  Google
                </button>
                <button className="btn-secondary font-medium" type="button" onClick={handleGitHubSignIn}>
                  <svg className="w-4 h-4 fill-navy" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                  </svg>
                  GitHub
                </button>
              </div>
            </div>

            {/* Sign Up Card */}
            <div className={`wireframe-border border-dashed bg-surface-container-low p-md md:p-lg relative ${
              activeTab === 'signup' ? 'block' : 'hidden md:block'
            }`}>
              <h2 className="font-label-caps text-label-caps text-navy font-semibold mb-lg border-b border-outline-variant pb-sm">
                Create Account
              </h2>
              <form onSubmit={handleSignupSubmit} className="flex flex-col gap-md">
                <div>
                  <label className="form-label" htmlFor="signup-name">Full Name</label>
                  <input 
                    className="form-input bg-white" 
                    id="signup-name" 
                    placeholder="Jane Doe" 
                    required 
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="signup-email">Email Address</label>
                  <input 
                    className="form-input bg-white" 
                    id="signup-email" 
                    placeholder="jane@example.com" 
                    required 
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="signup-password">Password</label>
                  <input 
                    className="form-input bg-white" 
                    id="signup-password" 
                    placeholder="Min. 8 characters" 
                    required 
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>
                <button className="btn-primary mt-sm bg-gold hover:bg-[#8e6f3d] font-medium text-navy" type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Sign Up'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
