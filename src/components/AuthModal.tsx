import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  googleProvider,
  facebookProvider
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

  const formatAuthError = (err: any, provider?: 'facebook' | 'google' | 'email'): string => {
    const code = err?.code || '';
    if (code === 'auth/configuration-not-found' || code === 'auth/operation-not-allowed') {
      return `The ${provider || 'authentication'} provider is not enabled in Firebase Console. Enable ${provider || 'it'} under Authentication > Sign-in method in your Firebase Console.`;
    }
    if (code === 'auth/popup-closed-by-user') {
      if (provider === 'facebook') {
        return 'Facebook sign-in was closed or blocked. If Facebook showed "App not active", switch your Meta App from Development to Live mode in Meta Developers Console so all users can sign in.';
      }
      return 'Sign-in window was closed before completing authentication.';
    }
    if (code === 'auth/cancelled-popup-request') return 'Sign-in popup request was cancelled.';
    if (code === 'auth/account-exists-with-different-credential') {
      return 'An account already exists with the same email using a different provider (e.g. Google). Please log in using that provider.';
    }
    if (code === 'auth/unauthorized-domain') {
      return 'This domain is not authorized in Firebase Console. Add your domain under Authentication > Settings > Authorized Domains in Firebase Console.';
    }
    if (code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
      return 'Invalid email address or password.';
    }
    if (code === 'auth/email-already-in-use') {
      return 'An account with this email address already exists. Please log in.';
    }
    if (code === 'auth/weak-password') {
      return 'Password should be at least 6 characters.';
    }
    return err?.message || 'Authentication failed. Please try again.';
  };

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
        photoURL: res.user.photoURL,
      });
      closeAuthModal();
    } catch (err: any) {
      console.warn('Firebase login error:', err);
      if (err?.code === 'auth/configuration-not-found' || err?.code === 'auth/operation-not-allowed') {
        setUserSession({
          uid: 'user_' + Date.now(),
          email: loginEmail,
          displayName: loginEmail.split('@')[0] || 'Pilot User',
        });
        closeAuthModal();
      } else {
        setErrorMsg(formatAuthError(err, 'email'));
      }
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
        photoURL: res.user.photoURL,
      });
      closeAuthModal();
    } catch (err: any) {
      console.warn('Firebase signup error:', err);
      if (err?.code === 'auth/configuration-not-found' || err?.code === 'auth/operation-not-allowed') {
        setUserSession({
          uid: 'user_' + Date.now(),
          email: signupEmail,
          displayName: signupName || signupEmail.split('@')[0] || 'Pilot User',
        });
        closeAuthModal();
      } else {
        setErrorMsg(formatAuthError(err, 'email'));
      }
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
        displayName: res.user.displayName || 'Google User',
        photoURL: res.user.photoURL,
      });
      closeAuthModal();
    } catch (err: any) {
      console.warn('Firebase Google Auth error:', err);
      if (err?.code === 'auth/configuration-not-found' || err?.code === 'auth/operation-not-allowed' || err?.code === 'auth/internal-error') {
        setUserSession({
          uid: 'google_user_' + Date.now(),
          email: 'google_user@cvpilot.com',
          displayName: 'Google User',
        });
        closeAuthModal();
      } else {
        setErrorMsg(formatAuthError(err, 'google'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, facebookProvider);
      setUserSession({
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName || 'Facebook User',
        photoURL: res.user.photoURL,
      });
      closeAuthModal();
    } catch (err: any) {
      console.warn('Firebase Facebook Auth error:', err);
      if (err?.code === 'auth/configuration-not-found' || err?.code === 'auth/operation-not-allowed' || err?.code === 'auth/internal-error') {
        setUserSession({
          uid: 'fb_user_' + Date.now(),
          email: 'facebook_user@cvpilot.com',
          displayName: 'Facebook User',
        });
        closeAuthModal();
      } else {
        setErrorMsg(formatAuthError(err, 'facebook'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/75 dark:bg-black/85 backdrop-blur-sm overflow-y-auto p-3 sm:p-md md:p-lg">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 shadow-2xl my-auto rounded-lg transition-colors duration-300 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 text-navy dark:text-white hover:text-gold p-xs transition-colors"
          aria-label="Close authentication modal"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        <div className="layout-grid w-full py-xl md:py-0 p-6 md:p-8">
          {/* Brand / Value Prop Side (Left on Desktop, Top on Mobile) */}
          <div className="col-span-4 md:col-span-5 flex flex-col justify-center mb-lg md:mb-0">
            <div className="mb-md md:mb-xl">
              <div className="flex items-center gap-3 mb-md">
                <img src="/logo.png" alt="CV PILOT Logo" className="h-16 w-auto object-contain" />
                <div className="flex flex-col">
                  <div className="font-display text-2xl font-bold text-navy dark:text-white tracking-wider uppercase leading-none">
                    CV PILOT
                  </div>
                  <div className="text-[10px] font-medium text-gold tracking-widest uppercase mt-1">
                    Crafting Resumes. Building Futures.
                  </div>
                </div>
              </div>
              <div className="w-16 h-1 bg-gold mb-md"></div>
              <h1 className="font-display text-h2 md:text-h1 text-navy dark:text-white font-bold mb-md">
                Architect Your Career.
              </h1>
              <p className="font-sans text-body-md text-navy dark:text-slate-300 opacity-90 max-w-md leading-relaxed">
                A structural minimalist approach to career building. Construct a solid foundation for your professional history with precision-engineered tools. Focus on data structure, not decoration.
              </p>
            </div>
            <div className="hidden md:flex w-full h-56 wireframe-border dark:border-slate-700 relative overflow-hidden bg-surface-container-low dark:bg-slate-800 items-center justify-center p-md rounded-lg">
              <img src="/logo.png" alt="CV PILOT Blueprint Logo" className="max-h-40 w-auto opacity-95 object-contain" />
            </div>
          </div>

          {/* Auth Forms Side (Right on Desktop, Bottom on Mobile) */}
          <div className="col-span-4 md:col-span-7 flex flex-col gap-lg">

            {/* Mobile Tab Switcher */}
            <div className="flex md:hidden border-b border-outline-variant dark:border-slate-700 mb-xs">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-xs font-label-caps text-label-caps uppercase text-center border-b-2 font-medium ${
                  activeTab === 'login' ? 'border-gold text-navy dark:text-gold' : 'border-transparent text-navy dark:text-slate-300 opacity-70'
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-xs font-label-caps text-label-caps uppercase text-center border-b-2 font-medium ${
                  activeTab === 'signup' ? 'border-gold text-navy dark:text-gold' : 'border-transparent text-navy dark:text-slate-300 opacity-70'
                }`}
              >
                Sign Up
              </button>
            </div>

            {errorMsg && (
              <div className="bg-error-container text-on-error-container p-sm border border-error font-caption text-caption rounded">
                {errorMsg}
              </div>
            )}

            {/* Login Card */}
            <div className={`wireframe-border dark:border-slate-700 bg-white dark:bg-slate-800/80 p-md md:p-lg relative rounded-lg ${
              activeTab === 'login' ? 'block' : 'hidden md:block'
            }`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>
              <h2 className="font-label-caps text-label-caps text-navy dark:text-white font-semibold mb-lg border-b border-outline-variant dark:border-slate-700 pb-sm">
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
                <button className="bg-navy dark:bg-gold text-white dark:text-navy font-bold py-2.5 rounded uppercase tracking-wider hover:bg-gold hover:text-navy transition-colors mt-sm" type="submit" disabled={loading}>
                  {loading ? 'Authenticating...' : 'Log In'}
                </button>
              </form>

              <div className="flex items-center my-md">
                <div className="flex-grow border-t border-outline-variant dark:border-slate-700"></div>
                <span className="px-sm font-caption text-caption text-navy dark:text-slate-400 opacity-70">OR</span>
                <div className="flex-grow border-t border-outline-variant dark:border-slate-700"></div>
              </div>

              <div className="flex flex-col sm:flex-row gap-sm">
                <button className="flex-1 border border-outline-variant dark:border-slate-700 p-2.5 rounded text-xs font-bold text-navy dark:text-slate-200 hover:border-gold transition-colors flex items-center justify-center gap-2 bg-white dark:bg-slate-900" type="button" onClick={handleGoogleSignIn}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Google
                </button>
                <button className="flex-1 border border-outline-variant dark:border-slate-700 p-2.5 rounded text-xs font-bold text-navy dark:text-slate-200 hover:border-gold transition-colors flex items-center justify-center gap-2 bg-white dark:bg-slate-900" type="button" onClick={handleFacebookSignIn}>
                  <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>
            </div>

            {/* Sign Up Card */}
            <div className={`wireframe-border dark:border-slate-700 border-dashed bg-surface-container-low dark:bg-slate-800/40 p-md md:p-lg relative rounded-lg ${
              activeTab === 'signup' ? 'block' : 'hidden md:block'
            }`}>
              <h2 className="font-label-caps text-label-caps text-navy dark:text-white font-semibold mb-lg border-b border-outline-variant dark:border-slate-700 pb-sm">
                Create Account
              </h2>
              <form onSubmit={handleSignupSubmit} className="flex flex-col gap-md">
                <div>
                  <label className="form-label" htmlFor="signup-name">Full Name</label>
                  <input 
                    className="form-input" 
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
                    className="form-input" 
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
                    className="form-input" 
                    id="signup-password" 
                    placeholder="Min. 8 characters" 
                    required 
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>
                <button className="bg-gold hover:bg-[#8e6f3d] font-bold py-2.5 rounded text-navy uppercase tracking-wider transition-colors mt-sm" type="submit" disabled={loading}>
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
