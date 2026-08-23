import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useMembership } from './MembershipContext';
import type { ResumeData } from '../types/resume';
import type { TemplateConfig } from '../types/templateEngine';
import { getInitialResumeData } from '../utils/aiGenerator';
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
  createNewResume: (templateId?: string) => string | null;
  selectActiveResume: (id: string) => void;
  updateActiveResume: (data: ResumeData, config?: TemplateConfig) => void;
  deleteResume: (id: string) => void;
  saveResumeToCloud: (resume: SavedUserResume) => Promise<void>;
  isLoading: boolean;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { isProMember, openUpgradeModal } = useMembership();
  const [resumes, setResumes] = useState<SavedUserResume[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Storage key helper for current user
  const storageKey = user ? `cvpilot_user_resumes_${user.uid}` : 'cvpilot_guest_resumes';

  // Helper to generate default initial resumes for new users
  const createDefaultResumes = (userName?: string, userEmail?: string): SavedUserResume[] => {
    const initialData1 = getInitialResumeData(userName || 'Senior UX Designer', userEmail || 'designer@techcorp.com');
    initialData1.title = 'Senior UX Designer Role';
    initialData1.personalInfo.jobTitle = 'Senior UX & Product Designer';
    initialData1.templateId = 'modern-minimal';

    const initialData2 = getInitialResumeData(userName || 'Frontend Engineer', userEmail || 'engineer@startup.io');
    initialData2.title = 'Frontend Engineer - Startup Profile';
    initialData2.personalInfo.jobTitle = 'Senior Frontend Engineer';
    initialData2.templateId = 'creative-sidebar';

    const currentDateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return [
      {
        id: 'res_1',
        title: initialData1.title,
        templateId: initialData1.templateId,
        lastEdited: currentDateStr,
        status: 'draft',
        data: initialData1,
        config: getTemplateConfigById('modern-minimal'),
      },
      {
        id: 'res_2',
        title: initialData2.title,
        templateId: initialData2.templateId,
        lastEdited: currentDateStr,
        status: 'published',
        data: initialData2,
        config: getTemplateConfigById('creative-sidebar'),
      }
    ];
  };

  // Load user's saved resumes whenever logged-in user changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadUserResumes = async () => {
      if (!user) {
        if (isMounted) {
          setResumes([]);
          setActiveResumeId(null);
          setIsLoading(false);
        }
        return;
      }

      // 1. Try local storage first for instant UI response
      const localData = localStorage.getItem(storageKey);
      let loadedResumes: SavedUserResume[] = [];

      if (localData) {
        try {
          loadedResumes = JSON.parse(localData);
        } catch (_e) {
          loadedResumes = [];
        }
      }

      // 2. Try Firestore Cloud Sync if user is authenticated
      try {
        const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'resumes'));
        if (!querySnapshot.empty) {
          const cloudResumes: SavedUserResume[] = [];
          querySnapshot.forEach((docSnap) => {
            cloudResumes.push(docSnap.data() as SavedUserResume);
          });
          if (cloudResumes.length > 0) {
            loadedResumes = cloudResumes;
          }
        }
      } catch (err) {
        console.warn('Firestore load fallback to localStorage:', err);
      }

      // If no resumes exist for user yet, create initial default templates for user
      if (loadedResumes.length === 0) {
        loadedResumes = createDefaultResumes(user.displayName || undefined, user.email || undefined);
      }

      if (isMounted) {
        setResumes(loadedResumes);
        localStorage.setItem(storageKey, JSON.stringify(loadedResumes));
        if (loadedResumes.length > 0) {
          setActiveResumeId(loadedResumes[0].id);
        }
        setIsLoading(false);
      }
    };

    loadUserResumes();

    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  // Save resume to Firestore Cloud & localStorage
  const saveResumeToCloud = async (resume: SavedUserResume) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid, 'resumes', resume.id), resume);
    } catch (err) {
      console.warn('Firestore cloud save notice:', err);
    }
  };

  const createNewResume = (templateId: string = 'modern-minimal'): string | null => {
    // Basic plan limit enforcement: Only 1 CV allowed for free users
    if (!isProMember && resumes.length >= 1) {
      openUpgradeModal();
      return null;
    }

    const newId = 'res_' + Date.now();
    const initialData = getInitialResumeData(user?.displayName || undefined, user?.email || undefined);
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
    if (!activeResumeId) return;

    const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const updatedList = resumes.map(r => {
      if (r.id === activeResumeId) {
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
