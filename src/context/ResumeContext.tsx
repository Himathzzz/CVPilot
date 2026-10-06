import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useMembership } from './MembershipContext';
import type { ResumeData } from '../types/resume';
import type { TemplateConfig } from '../types/templateEngine';
import { getInitialResumeData, getEmptyResumeData } from '../utils/aiGenerator';
import { getTemplateConfigById } from '../data/templatePacks';
import { db } from '../firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

export interface SavedUserResume {
  id: string;
  title: string;
  templateId: string;
  lastEdited: string;
  status: 'draft' | 'published';
  data: ResumeData;
  config?: TemplateConfig;
}

interface ResumeContextType {
  resumes: SavedUserResume[];
  activeResumeId: string | null;
  activeResume: SavedUserResume | null;
  createNewResume: (templateId?: string, isBlank?: boolean) => string | null;
  selectActiveResume: (id: string) => void;
  updateActiveResume: (data: ResumeData, config?: TemplateConfig) => void;
  deleteResume: (id: string) => void;
  saveResumeToCloud: (resume: SavedUserResume) => Promise<void>;
  isLoading: boolean;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// Helper to safely load resumes synchronously from multiple local storage fallback keys
const getStoredResumes = (userId?: string | null): SavedUserResume[] => {
  if (typeof window === 'undefined') return [];

  const keysToTry = [
    userId ? `cvpilot_user_resumes_${userId}` : null,
    'cvpilot_guest_resumes',
    'cvpilot_resumes_backup'
  ].filter(Boolean) as string[];

  // Also look for any user resume keys in localStorage
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('cvpilot_user_resumes_') && !keysToTry.includes(k)) {
        keysToTry.push(k);
      }
    }
  } catch {}

  for (const key of keysToTry) {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter(r => r && r.id && r.id !== 'res_1' && r.id !== 'res_2');
          if (valid.length > 0) return valid;
        }
      } catch {}
    }
  }

  // Fallback: Check if there's a draft resume in the builder
  try {
    const draft = localStorage.getItem('cvpilot_builder_draft_resume');
    if (draft) {
      const parsedDraft = JSON.parse(draft);
      if (parsedDraft && parsedDraft.personalInfo && (parsedDraft.personalInfo.fullName || parsedDraft.personalInfo.jobTitle)) {
        const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const templateId = parsedDraft.templateId || 'modern-minimal';
        return [{
          id: 'res_' + Date.now(),
          title: parsedDraft.personalInfo.jobTitle ? `${parsedDraft.personalInfo.jobTitle} Resume` : 'My Resume',
          templateId,
          lastEdited: currentDate,
          status: 'draft',
          data: parsedDraft,
          config: getTemplateConfigById(templateId),
        }];
      }
    }
  } catch {}

  return [];
};

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { isProMember, openUpgradeModal } = useMembership();

  // Storage key helper for current user
  const storageKey = user ? `cvpilot_user_resumes_${user.uid}` : 'cvpilot_guest_resumes';

  // Synchronous immediate initialization from localStorage so resumes NEVER disappear on refresh
  const [resumes, setResumes] = useState<SavedUserResume[]>(() => {
    let initialUserId: string | null = null;
    try {
      const saved = localStorage.getItem('cvpilot_user_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.uid) initialUserId = parsed.uid;
      }
    } catch {}
    return getStoredResumes(initialUserId);
  });

  const [activeResumeId, setActiveResumeId] = useState<string | null>(() => {
    let initialUserId: string | null = null;
    try {
      const saved = localStorage.getItem('cvpilot_user_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.uid) initialUserId = parsed.uid;
      }
    } catch {}
    const initial = getStoredResumes(initialUserId);
    return initial.length > 0 ? initial[0].id : null;
  });

  const [isLoading] = useState<boolean>(false);

  // Sync / verify saved resumes when logged-in user changes or mounts
  useEffect(() => {
    let isMounted = true;

    // 1. Immediately read from localStorage
    const localResumes = getStoredResumes(user?.uid);
    if (localResumes.length > 0) {
      setResumes(localResumes);
      setActiveResumeId(prev => prev || localResumes[0].id);
      localStorage.setItem(storageKey, JSON.stringify(localResumes));
    }

    // 2. Try Firestore Cloud Sync non-blockingly with a 3-second timeout
    if (user?.uid) {
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
      const fetchPromise = getDocs(collection(db, 'users', user.uid, 'resumes')).catch((err) => {
        console.warn('Firestore load notice:', err);
        return null;
      });

      Promise.race([fetchPromise, timeoutPromise]).then((querySnapshot: any) => {
        if (!isMounted || !querySnapshot || querySnapshot.empty) return;
        const cloudResumes: SavedUserResume[] = [];
        querySnapshot.forEach((docSnap: any) => {
          const data = docSnap.data() as SavedUserResume;
          if (data && data.id && data.id !== 'res_1' && data.id !== 'res_2') {
            cloudResumes.push(data);
          }
        });
        if (cloudResumes.length > 0) {
          setResumes(prev => {
            // Keep existing local resumes and merge any additional from cloud
            const existingIds = new Set(prev.map(r => r.id));
            const newFromCloud = cloudResumes.filter(r => !existingIds.has(r.id));
            const combined = [...prev, ...newFromCloud];
            localStorage.setItem(storageKey, JSON.stringify(combined));
            return combined;
          });
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [user?.uid, storageKey]);

  // Save resume to Firestore Cloud & localStorage safely
  const saveResumeToCloud = async (resume: SavedUserResume) => {
    if (!user) return;
    try {
      const cleanData = JSON.parse(JSON.stringify(resume));
      await setDoc(doc(db, 'users', user.uid, 'resumes', resume.id), cleanData);
    } catch (err) {
      console.warn('Firestore cloud save notice:', err);
    }
  };

  const createNewResume = (templateId: string = 'modern-minimal', isBlank: boolean = true): string | null => {
    // Basic plan limit enforcement: Free users are strictly limited to 1 CV
    if (!isProMember && resumes.length >= 1) {
      openUpgradeModal();
      return null;
    }

    const newId = 'res_' + Date.now();
    const initialData = isBlank
      ? getEmptyResumeData(user?.displayName || undefined, user?.email || undefined)
      : getInitialResumeData(user?.displayName || undefined, user?.email || undefined);

    initialData.templateId = templateId;
    initialData.title = `Resume - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const newResume: SavedUserResume = {
      id: newId,
      title: newResumeTitle(templateId),
      templateId,
      lastEdited: currentDate,
      status: 'draft',
      data: initialData,
      config: getTemplateConfigById(templateId),
    };

    const updated = [newResume, ...resumes];
    setResumes(updated);
    setActiveResumeId(newId);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    localStorage.setItem('cvpilot_guest_resumes', JSON.stringify(updated));
    localStorage.setItem('cvpilot_resumes_backup', JSON.stringify(updated));
    localStorage.setItem('cvpilot_builder_draft_resume', JSON.stringify(initialData));
    saveResumeToCloud(newResume);

    return newId;
  };

  const newResumeTitle = (templateId: string): string => {
    const config = getTemplateConfigById(templateId);
    return `${config.name} Resume`;
  };

  const selectActiveResume = (id: string) => {
    const existing = resumes.find(r => r.id === id);
    if (existing) {
      setActiveResumeId(id);
    }
  };

  const updateActiveResume = (data: ResumeData, config?: TemplateConfig) => {
    const targetId = activeResumeId || (resumes.length > 0 ? resumes[0].id : null);
    const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (!targetId) {
      // Auto-create initial resume entry so user edits are never lost
      const newId = 'res_' + Date.now();
      const newResume: SavedUserResume = {
        id: newId,
        title: data.personalInfo.jobTitle ? `${data.personalInfo.jobTitle} Resume` : 'My Resume',
        templateId: data.templateId || 'modern-minimal',
        lastEdited: currentDate,
        status: 'draft',
        data,
        config: config || getTemplateConfigById(data.templateId || 'modern-minimal'),
      };
      const updated = [newResume];
      setResumes(updated);
      setActiveResumeId(newId);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      localStorage.setItem('cvpilot_guest_resumes', JSON.stringify(updated));
      localStorage.setItem('cvpilot_resumes_backup', JSON.stringify(updated));
      saveResumeToCloud(newResume);
      return;
    }

    const updatedList = resumes.map(r => {
      if (r.id === targetId) {
        const updated: SavedUserResume = {
          ...r,
          title: data.personalInfo.jobTitle ? `${data.personalInfo.jobTitle} Resume` : r.title,
          templateId: data.templateId || r.templateId,
          lastEdited: currentDate,
          data,
          config: config || r.config,
        };
        saveResumeToCloud(updated);
        return updated;
      }
      return r;
    });

    setResumes(updatedList);
    localStorage.setItem(storageKey, JSON.stringify(updatedList));
    localStorage.setItem('cvpilot_guest_resumes', JSON.stringify(updatedList));
    localStorage.setItem('cvpilot_resumes_backup', JSON.stringify(updatedList));
  };

  const deleteResume = (id: string) => {
    const filtered = resumes.filter(r => r.id !== id);
    setResumes(filtered);
    localStorage.setItem(storageKey, JSON.stringify(filtered));
    if (activeResumeId === id) {
      setActiveResumeId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  const activeResume = resumes.find(r => r.id === activeResumeId) || (resumes.length > 0 ? resumes[0] : null);

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        activeResumeId,
        activeResume,
        createNewResume,
        selectActiveResume,
        updateActiveResume,
        deleteResume,
        saveResumeToCloud,
        isLoading,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResumes = (): ResumeContextType => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResumes must be used within a ResumeProvider');
  }
  return context;
};
