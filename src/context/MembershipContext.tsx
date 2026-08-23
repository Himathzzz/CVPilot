import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface MembershipContextType {
  isProMember: boolean;
  upgradeToPro: () => Promise<void>;
  downgradeToFree: () => Promise<void>;
  isUpgradeModalOpen: boolean;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

export const MembershipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  
  // Initialize state immediately from localStorage to eliminate refresh flicker
  const [isProMember, setIsProMember] = useState<boolean>(() => {
    const savedSession = localStorage.getItem('cvpilot_user_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed?.uid) {
          const savedPro = localStorage.getItem(`cvpilot_pro_membership_${parsed.uid}`);
          if (savedPro !== null) return savedPro === 'true';
        }
      } catch (_e) {
        // Fallback
      }
    }
    const guestPro = localStorage.getItem('cvpilot_pro_membership_guest');
    return guestPro === 'true';
  });

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const storageKey = user ? `cvpilot_pro_membership_${user.uid}` : 'cvpilot_pro_membership_guest';

  // Load user membership whenever active user or auth loading state changes
  useEffect(() => {
    let isMounted = true;

    const loadMembership = async () => {
      // Don't reset membership to false while Firebase Auth is still initializing on refresh!
      if (!user) {
        if (authLoading) return;
        if (isMounted) setIsProMember(false);
        return;
      }

      // 1. Try local storage first for instant 0ms UI response
      const localVal = localStorage.getItem(storageKey);
      let isPro = localVal === 'true';
      if (isMounted && localVal !== null) {
        setIsProMember(isPro);
      }

      // 2. Sync with Cloud Firestore asynchronously
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.isProMember !== undefined) {
            isPro = Boolean(userData.isProMember);
            if (isMounted) {
              setIsProMember(isPro);
              localStorage.setItem(storageKey, isPro ? 'true' : 'false');
            }
          }
        }
      } catch (err) {
        console.warn('Firestore membership load notice:', err);
      }
    };

    loadMembership();

    return () => {
      isMounted = false;
    };
  }, [user?.uid, authLoading, storageKey]);

  const upgradeToPro = async () => {
    setIsProMember(true);
    localStorage.setItem(storageKey, 'true');
    setIsUpgradeModalOpen(false);

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          isProMember: true,
          proPurchasedAt: new Date().toISOString(),
          plan: 'pro_monthly_5usd',
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore cloud membership save notice:', err);
      }
    }
  };

  const downgradeToFree = async () => {
    setIsProMember(false);
    localStorage.setItem(storageKey, 'false');

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          isProMember: false,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore cloud downgrade notice:', err);
      }
    }
  };

  const openUpgradeModal = () => setIsUpgradeModalOpen(true);
  const closeUpgradeModal = () => setIsUpgradeModalOpen(false);

  return (
    <MembershipContext.Provider
      value={{
        isProMember,
        upgradeToPro,
        downgradeToFree,
        isUpgradeModalOpen,
        openUpgradeModal,
        closeUpgradeModal
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
};

export const useMembership = () => {
  const context = useContext(MembershipContext);
  if (!context) {
    throw new Error('useMembership must be used within a MembershipProvider');
  }
  return context;
};
