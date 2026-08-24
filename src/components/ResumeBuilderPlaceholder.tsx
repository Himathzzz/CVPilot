import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMembership } from '../context/MembershipContext';
import { useResumes } from '../context/ResumeContext';
import type { ResumeData, ResumeTemplateId, ExperienceItem, SkillCategory, EducationItem } from '../types/resume';
import { TemplateEngine } from '../engine/TemplateEngine';
import { TemplateCustomizer } from './TemplateCustomizer';
import { generateAISummary, enhanceBulletPoint, suggestSkillsForRole, getInitialResumeData } from '../utils/aiGenerator';
import { TemplateLibraryModal } from './TemplateLibraryModal';
import { UpgradeModal } from './UpgradeModal';
import { ThemeToggle } from './ThemeToggle';
import { getTemplateConfigById } from '../data/templatePacks';
import type { TemplateConfig } from '../types/templateEngine';

interface ResumeBuilderProps {
  onBackToHome: () => void;
  initialTemplate?: ResumeTemplateId;
}

type StepTab = 'all' | 'heading' | 'experience' | 'education' | 'skills' | 'summary' | 'finalize';

export const ResumeBuilderPlaceholder: React.FC<ResumeBuilderProps> = ({ onBackToHome, initialTemplate = 'modern-minimal' }) => {
  const { user } = useAuth();
  const { isProMember, openUpgradeModal } = useMembership();
  const { activeResume, updateActiveResume } = useResumes();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [activeStepTab, setActiveStepTab] = useState<StepTab>('heading');

  // Resume Data State
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    if (activeResume?.data) {
      return activeResume.data;
    }
    const initial = getInitialResumeData(user?.displayName || undefined, user?.email || undefined);
    if (initialTemplate) {
      initial.templateId = initialTemplate;
    }
    return initial;
  });

  // Current Template JSON Config State
  const [currentConfig, setCurrentConfig] = useState<TemplateConfig>(() => {
    if (activeResume?.config) {
      return activeResume.config;
    }
    return getTemplateConfigById(initialTemplate || 'modern-minimal');
  });

  // Automatically save changes
  React.useEffect(() => {
    updateActiveResume(resumeData, currentConfig);
  }, [resumeData, currentConfig]);

  React.useEffect(() => {
    if (initialTemplate) {
      const newConfig = getTemplateConfigById(initialTemplate);
      setCurrentConfig(newConfig);
      setResumeData(prev => ({ ...prev, templateId: initialTemplate }));
    }
  }, [initialTemplate]);

  // AI Loading States
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiNotification, setAiNotification] = useState<string | null>(null);
  const [targetRoleInput, setTargetRoleInput] = useState(resumeData.personalInfo.jobTitle || 'Full Stack Engineer');

  const showNotification = (msg: string) => {
    setAiNotification(msg);
    setTimeout(() => setAiNotification(null), 3500);
  };

  // Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            photoUrl: reader.result as string,
            showPhoto: true
          }
        }));
        showNotification('Profile photo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Handlers
  const handleGenerateAISummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const role = resumeData.personalInfo.jobTitle || 'Professional';
      const summary = await generateAISummary(role, resumeData.experiences.map(e => e.role).join(', '));
      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          summary
        }
      }));
      showNotification('✨ AI Summary generated!');
    } catch (err) {
      console.error(err);
      showNotification('AI Summary error.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleEnhanceBullet = async (expId: string, currentDesc: string) => {
    if (!currentDesc) return;
    try {
      const enhanced = await enhanceBulletPoint(currentDesc);
      setResumeData(prev => ({
        ...prev,
        experiences: prev.experiences.map(e => e.id === expId ? { ...e, description: enhanced } : e)
      }));
      showNotification('⚡ Bullet enhanced with AI!');
    } catch (err) {
      console.error(err);
      showNotification('Enhance failed.');
    }
  };

  const handleSuggestSkills = async () => {
    try {
      const skills = await suggestSkillsForRole(targetRoleInput);
      if (skills && skills.length > 0) {
        setResumeData(prev => {
          const techCategory = prev.skillCategories.find(s => s.categoryName.toLowerCase().includes('technical')) || prev.skillCategories[0];
          if (!techCategory) return prev;
          const currentSkillsList: string[] = techCategory.skills || [];
          const updatedSkills: string[] = Array.from(new Set([...currentSkillsList, ...(skills as unknown as string[])]));
          return {
            ...prev,
            skillCategories: prev.skillCategories.map(s => s.id === techCategory.id ? { ...s, skills: updatedSkills } : s)
          };
        });
        showNotification(`💡 Added ${skills.length} AI suggested skills!`);
      }
    } catch (err) {
      console.error(err);
      showNotification('Skill suggestions failed.');
    }
  };

  // Form Handlers
  const handlePersonalInfoChange = (field: keyof ResumeData['personalInfo'], val: any) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: val
      }
    }));
  };

  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: Date.now().toString(),
      company: 'New Tech Corp',
      role: 'Software Engineer',
      startDate: '2023',
      endDate: 'Present',
      isCurrent: true,
      location: 'San Francisco, CA',
      description: 'Led software initiatives and optimized performance.',
      bulletPoints: ['Architected cloud infrastructure', 'Optimized application load times']
    };
    setResumeData(prev => ({ ...prev, experiences: [...prev.experiences, newExp] }));
  };

  const handleRemoveExperience = (id: string) => {
    setResumeData(prev => ({ ...prev, experiences: prev.experiences.filter(e => e.id !== id) }));
  };

  const handleExperienceChange = (id: string, field: keyof ExperienceItem, val: any) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => e.id === id ? { ...e, [field]: val } : e)
    }));
  };

  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: Date.now().toString(),
      institution: 'University Name',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2019',
      endDate: '2023',
      location: 'Boston, MA'
    };
    setResumeData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const handleRemoveEducation = (id: string) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  };

  const handleEducationChange = (id: string, field: keyof EducationItem, val: any) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [field]: val } : e)
    }));
  };

  const handleAddSkillCategory = () => {
    const newCat: SkillCategory = {
      id: Date.now().toString(),
      categoryName: 'Domain Expertise',
      skills: ['Strategic Planning', 'Leadership', 'Problem Solving']
    };
    setResumeData(prev => ({ ...prev, skillCategories: [...prev.skillCategories, newCat] }));
  };

  const handleUpdateSkillCategory = (id: string, name: string, skillsStr: string) => {
    const skillsArr = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
    setResumeData(prev => ({
      ...prev,
      skillCategories: prev.skillCategories.map(s => s.id === id ? { ...s, categoryName: name, skills: skillsArr } : s)
    }));
  };

  const isCurrentTemplatePro = currentConfig.isPremium;
  const isTemplateLocked = isCurrentTemplatePro && !isProMember;

  const handleExportPDF = () => {
    if (isTemplateLocked) {
      showNotification('🔒 Premium template is locked! Upgrade for $5/mo to export.');
      openUpgradeModal();
      return;
    }
    window.print();
  };

  const handleSelectTemplateConfig = (config: TemplateConfig) => {
    setCurrentConfig(config);
    setResumeData(prev => ({ ...prev, templateId: config.id }));
    showNotification(`Selected ${config.name} template!`);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveCV = () => {
    setIsSaving(true);
    updateActiveResume(resumeData, currentConfig);
    showNotification('✅ CV Saved Successfully!');
    setTimeout(() => setIsSaving(false), 2000);
  };

  const stepsList: { id: StepTab; label: string; icon: string }[] = [
    { id: 'heading', label: '1. Heading', icon: 'person' },
    { id: 'experience', label: '2. Work History', icon: 'work' },
    { id: 'education', label: '3. Education', icon: 'school' },
    { id: 'skills', label: '4. Skills', icon: 'psychology' },
    { id: 'summary', label: '5. Summary', icon: 'format_quote' },
    { id: 'finalize', label: '6. Finalize', icon: 'verified' },
    { id: 'all', label: 'View All', icon: 'grid_view' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col print:bg-white print:p-0">
      {/* Toast Notification */}
      {aiNotification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white border border-blue-500/40 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-bounce">
          <span className="material-symbols-outlined text-blue-400 text-base">auto_awesome</span>
          <span>{aiNotification}</span>
        </div>
      )}

      {/* Editor Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-wrap justify-between items-center gap-3 shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Dashboard
          </button>
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="CV PILOT Logo" className="h-7 w-auto object-contain" />
            <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight hidden sm:inline">
              Resumaker Builder
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            onClick={() => setIsLibraryOpen(true)}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <span className="material-symbols-outlined text-sm text-blue-600">view_carousel</span>
            Templates
          </button>

          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <span className="material-symbols-outlined text-sm text-amber-500">palette</span>
            Design
          </button>

          <button
            onClick={handleSaveCV}
            className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all border border-slate-700"
          >
            <span className="material-symbols-outlined text-sm text-emerald-400">
              {isSaving ? 'check_circle' : 'save'}
            </span>
            {isSaving ? 'SAVED' : 'SAVE'}
          </button>

          <button 
            onClick={handleExportPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            DOWNLOAD PDF
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 max-w-[1600px] mx-auto w-full print:block print:p-0">
        
        {/* Left Form Panel */}
        <div className="lg:col-span-6 space-y-4 print:hidden">
          
          {/* Step Progress Wizard Bar */}
          <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-1 overflow-x-auto">
            {stepsList.map(step => (
              <button
                key={step.id}
                onClick={() => setActiveStepTab(step.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeStepTab === step.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{step.icon}</span>
                {step.label}
              </button>
            ))}
          </div>

          {/* AI Content Generator Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 rounded-2xl border border-indigo-500/30 shadow-md space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-xl">auto_awesome</span>
                <span className="font-bold text-xs uppercase tracking-wider">AI Content Generator</span>
              </div>
              <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30">Gemini AI</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleGenerateAISummary}
                disabled={isGeneratingSummary}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs p-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">psychology</span>
                {isGeneratingSummary ? 'Generating...' : 'Auto-Generate Summary'}
              </button>

              <div className="flex gap-1.5">
                <input 
                  type="text" 
                  value={targetRoleInput}
                  onChange={(e) => setTargetRoleInput(e.target.value)}
                  placeholder="Target Role" 
                  className="form-input text-xs py-2 px-3 bg-slate-800/80 text-white border-slate-700 rounded-xl w-full"
                />
                <button
                  onClick={handleSuggestSkills}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3 rounded-xl flex items-center shrink-0"
                  title="AI Skill Suggestions"
                >
                  <span className="material-symbols-outlined text-sm">lightbulb</span>
                </button>
              </div>
            </div>
          </div>

          {/* STEP 1: HEADING */}
          {(activeStepTab === 'heading' || activeStepTab === 'all') && (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-lg">person</span>
                  1. Contact Information
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="relative group shrink-0">
                  {resumeData.personalInfo.photoUrl ? (
                    <img 
                      src={resumeData.personalInfo.photoUrl} 
                      alt="Uploaded Photo" 
                      className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-xs" 
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined text-xl">add_a_photo</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-200">Profile Photo (Optional)</div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handlePhotoUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs px-3 py-1 rounded-lg uppercase tracking-wider transition-colors"
                  >
                    Upload Photo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                    className="form-input text-xs" 
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
                  <input 
                    type="text" 
                    value={resumeData.personalInfo.jobTitle}
                    onChange={(e) => handlePersonalInfoChange('jobTitle', e.target.value)}
                    className="form-input text-xs" 
                    placeholder="Senior Product Designer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={resumeData.personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    className="form-input text-xs" 
                    placeholder="jane.doe@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input 
                    type="text" 
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    className="form-input text-xs" 
                    placeholder="+1 (555) 234-5678"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                  <input 
                    type="text" 
                    value={resumeData.personalInfo.location}
                    onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                    className="form-input text-xs" 
                    placeholder="New York, NY"
                  />
                </div>
              </div>

              {activeStepTab === 'heading' && (
                <div className="flex justify-end pt-2">
                  <button 
                    onClick={() => setActiveStepTab('experience')}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1"
                  >
                    Next: Work History <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: WORK EXPERIENCE */}
          {(activeStepTab === 'experience' || activeStepTab === 'all') && (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-lg">work</span>
                  2. Work History
                </h3>
                <button 
                  onClick={handleAddExperience}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  Add Position
                </button>
              </div>

              <div className="space-y-4">
                {resumeData.experiences.map((exp, idx) => (
                  <div key={exp.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Position #{idx + 1}</span>
                      {resumeData.experiences.length > 1 && (
                        <button 
                          onClick={() => handleRemoveExperience(exp.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Company</label>
                        <input 
                          type="text" 
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                          className="form-input text-xs" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Role Title</label>
                        <input 
                          type="text" 
                          value={exp.role}
                          onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)}
                          className="form-input text-xs" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Start Date</label>
                        <input 
                          type="text" 
                          value={exp.startDate}
                          onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                          className="form-input text-xs" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">End Date</label>
                        <input 
                          type="text" 
                          value={exp.endDate}
                          onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                          className="form-input text-xs" 
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">Description & Bullets</label>
                        <button 
                          onClick={() => handleEnhanceBullet(exp.id, exp.description)}
                          className="text-[10px] font-bold text-amber-500 hover:underline flex items-center gap-0.5"
                        >
                          <span className="material-symbols-outlined text-xs">bolt</span>
                          AI Enhance
                        </button>
                      </div>
                      <textarea 
                        rows={2} 
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                        className="form-input text-xs" 
                      />
                    </div>
                  </div>
                ))}
              </div>

              {activeStepTab === 'experience' && (
                <div className="flex justify-between pt-2">
                  <button 
                    onClick={() => setActiveStepTab('heading')}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setActiveStepTab('education')}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase flex items-center gap-1"
                  >
                    Next: Education <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: EDUCATION */}
          {(activeStepTab === 'education' || activeStepTab === 'all') && (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-lg">school</span>
                  3. Education & Degrees
                </h3>
                <button 
                  onClick={handleAddEducation}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  Add Education
                </button>
              </div>

              <div className="space-y-4">
                {resumeData.education.map((edu, idx) => (
                  <div key={edu.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Degree #{idx + 1}</span>
                      {resumeData.education.length > 1 && (
                        <button 
                          onClick={() => handleRemoveEducation(edu.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Institution / University</label>
                        <input 
                          type="text" 
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                          className="form-input text-xs" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Degree / Major</label>
                        <input 
                          type="text" 
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                          className="form-input text-xs" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Start Date</label>
                        <input 
                          type="text" 
                          value={edu.startDate}
                          onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                          className="form-input text-xs" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">End Date</label>
                        <input 
                          type="text" 
                          value={edu.endDate}
                          onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                          className="form-input text-xs" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {activeStepTab === 'education' && (
                <div className="flex justify-between pt-2">
                  <button 
                    onClick={() => setActiveStepTab('experience')}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setActiveStepTab('skills')}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase flex items-center gap-1"
                  >
                    Next: Skills <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: SKILLS */}
          {(activeStepTab === 'skills' || activeStepTab === 'all') && (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-lg">psychology</span>
                  4. Skills & Competencies
                </h3>
                <button 
                  onClick={handleAddSkillCategory}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  Add Skill Group
                </button>
              </div>

              <div className="space-y-3">
                {resumeData.skillCategories.map((cat) => (
                  <div key={cat.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Category Name</label>
                      <input 
                        type="text" 
                        value={cat.categoryName}
                        onChange={(e) => handleUpdateSkillCategory(cat.id, e.target.value, cat.skills.join(', '))}
                        className="form-input text-xs" 
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Skills (Comma-separated)</label>
                      <input 
                        type="text" 
                        value={cat.skills.join(', ')}
                        onChange={(e) => handleUpdateSkillCategory(cat.id, cat.categoryName, e.target.value)}
                        className="form-input text-xs" 
                      />
                    </div>
                  </div>
                ))}
              </div>

              {activeStepTab === 'skills' && (
                <div className="flex justify-between pt-2">
                  <button 
                    onClick={() => setActiveStepTab('education')}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setActiveStepTab('summary')}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase flex items-center gap-1"
                  >
                    Next: Summary <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: SUMMARY */}
          {(activeStepTab === 'summary' || activeStepTab === 'all') && (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-lg">format_quote</span>
                  5. Professional Summary
                </h3>
                <button 
                  onClick={handleGenerateAISummary}
                  className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  Generate AI
                </button>
              </div>

              <textarea 
                rows={4} 
                value={resumeData.personalInfo.summary}
                onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                className="form-input text-xs leading-relaxed" 
                placeholder="Write a concise overview of your background and achievements..."
              />

              {activeStepTab === 'summary' && (
                <div className="flex justify-between pt-2">
                  <button 
                    onClick={() => setActiveStepTab('skills')}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setActiveStepTab('finalize')}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase flex items-center gap-1"
                  >
                    Next: Finalize <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: FINALIZE */}
          {(activeStepTab === 'finalize' || activeStepTab === 'all') && (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-500 text-lg">verified</span>
                  6. Finalize & Export
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                  ATS Score: 99/100
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  onClick={handleExportPDF}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  Export Print-Ready PDF
                </button>
                <button 
                  onClick={handleSaveCV}
                  className="flex-1 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base text-emerald-400">save</span>
                  Save to Account
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Live A4 Resume Preview Pane */}
        <div className="lg:col-span-6 print:w-full print:m-0">
          <div className="sticky top-20 flex flex-col gap-3 print:static print:block">
            
            {/* Controls Bar */}
            <div className="flex flex-wrap justify-between items-center gap-2 print:hidden bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-800 dark:text-slate-200 font-extrabold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Preview ({currentConfig.name})
              </span>

              {/* Zoom Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300">
                <button 
                  onClick={() => setZoomScale(s => Math.max(0.6, s - 0.1))} 
                  className="px-2 py-0.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg"
                  title="Zoom Out"
                >
                  -
                </button>
                <span className="px-1 text-[11px] font-mono">{Math.round(zoomScale * 100)}%</span>
                <button 
                  onClick={() => setZoomScale(s => Math.min(1.4, s + 0.1))} 
                  className="px-2 py-0.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg"
                  title="Zoom In"
                >
                  +
                </button>
                <button 
                  onClick={() => setZoomScale(1.0)} 
                  className="px-1.5 py-0.5 text-[10px] text-slate-500 hover:text-slate-900 dark:hover:text-white uppercase"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Resume Document Box */}
            <div 
              id="resume-document"
              className="bg-white shadow-2xl border border-slate-200 rounded-xl overflow-hidden min-h-[750px] relative print:shadow-none print:border-none print:w-full"
            >
              <TemplateEngine data={resumeData} config={currentConfig} zoomScale={zoomScale} />
            </div>
          </div>
        </div>

      </main>

      {/* Template Library Modal */}
      <TemplateLibraryModal 
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectTemplateConfig={handleSelectTemplateConfig}
        selectedTemplateId={resumeData.templateId}
      />

      {/* Live Customizer Drawer */}
      <TemplateCustomizer 
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={currentConfig}
        onChangeConfig={setCurrentConfig}
      />

      <UpgradeModal />
    </div>
  );
};
