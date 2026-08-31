import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useResumes } from '../context/ResumeContext';
import { useMembership } from '../context/MembershipContext';
import type { ResumeData, ResumeTemplateId } from '../types/resume';
import type { TemplateConfig } from '../types/templateEngine';
import { TemplateEngine } from '../engine/TemplateEngine';
import { getTemplateConfigById, TEMPLATE_PACKS } from '../data/templatePacks';
import { processAIChatTurn, calculateATSScore, type ChatMessage } from '../services/aiChatService';
import { getEmptyResumeData } from '../utils/aiGenerator';
import { ThemeToggle } from './ThemeToggle';
import { UpgradeModal } from './UpgradeModal';
import { TemplateLibraryModal } from './TemplateLibraryModal';

interface AIChatResumeBuilderProps {
  onBackToHome: () => void;
  onNavigateToBuilder: (templateId?: ResumeTemplateId) => void;
}

const PRESET_PROMPTS = [
  {
    title: 'Senior Software Architect',
    desc: 'TypeScript, React, Python, Cloud Microservices, Scalability',
    prompt: 'I am Jordan Lee, Senior Software Architect based in Seattle, WA. Email: jordan.lee@example.com, Phone: (555) 234-5678. Lead Architect at Microsoft (2021-Present) and Senior Backend Engineer at Amazon (2018-2021). Skills: TypeScript, React, Python, FastAPI, AWS, Docker, Kubernetes, GraphQL, Kafka, Distributed Systems. Degree: B.S. in Computer Science from University of Washington (2018), GPA 3.9/4.0.'
  },
  {
    title: 'Lead Product & UX Designer',
    desc: 'Figma, Design Systems, UX Strategy, User Research',
    prompt: 'Create a CV for a Lead Product Designer. Name: Maya Lin, San Francisco, CA. Email: maya.design@example.com. Senior Product Designer at Figma (2022-Present) and UI/UX Designer at Airbnb (2019-2022). Skills: Figma, User Research, Design Systems, Wireframing, Interaction Design, Prototyping, Usability Testing. Studied HCI at Stanford University (2019).'
  },
  {
    title: '🧠 Deep ATS Audit & Keyword Fix',
    desc: 'Audit active CV against 2026 hiring benchmarks & compute score',
    prompt: 'Can you perform a deep ATS keyword audit on my active resume, score its readiness out of 100, and list high-ROI optimizations to boost my recruiter interview callbacks?'
  },
  {
    title: '🎙️ Technical Interview Simulator',
    desc: 'STAR-method behavioral and system design interview questions',
    prompt: 'Give me top Tier-1 technical and leadership interview questions with the STAR method framework tailored specifically to my current job title and skill set.'
  },
  {
    title: 'Marketing Director',
    desc: 'Growth Marketing, Brand Strategy, Performance Funnels',
    prompt: 'Build an Executive CV for Marcus Vance, Marketing Director in New York, NY. Email: marcus.vance@example.com. Director of Growth at Stripe (2021-Present) and Marketing Manager at HubSpot (2017-2021). Skills: Growth Marketing, SEO/SEM, Brand Strategy, Product Launches, Analytics, Cross-functional Leadership. MBA from Columbia University (2017).'
  }
];

export const AIChatResumeBuilder: React.FC<AIChatResumeBuilderProps> = ({
  onBackToHome,
  onNavigateToBuilder
}) => {
  const { user, openAuthModal } = useAuth();
  const { updateActiveResume } = useResumes();
  const { isProMember, openUpgradeModal } = useMembership();

  // Resume Data State (Starts clean or restores draft from local storage on refresh)
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('cvpilot_aichat_resume_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.personalInfo) {
          return parsed;
        }
      } catch (_e) {
        // fallback
      }
    }
    return getEmptyResumeData();
  });

  // Template Config State
  const [currentConfig, setCurrentConfig] = useState<TemplateConfig>(() => {
    return getTemplateConfigById(resumeData.templateId || 'modern-minimal');
  });

  const isResumeEmpty = !resumeData.personalInfo.fullName &&
    !resumeData.personalInfo.jobTitle &&
    resumeData.experiences.length === 0 &&
    resumeData.education.length === 0 &&
    resumeData.skillCategories.length === 0;

  // Chat State (Restores conversation history on refresh)
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('cvpilot_aichat_messages_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }));
        }
      } catch (_e) {
        // fallback
      }
    }
    return [
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: `### 🧠 Welcome to **CV PILOT Neural AI Copilot**!
I am your dedicated Executive Career Architect with deep ATS calibration and multi-entity resume synthesis.

**What would you like to do?**
- ✍️ Tell me your **career background** (Name, role, experience, education, skills)
- 📋 **Paste your raw LinkedIn bio, notes, or existing resume text**
- 📊 Ask for a **Deep ATS Diagnostic** or **Interview Practice**
- ⚡ Or click one of the quick starter presets above!`,
        timestamp: new Date(),
        suggestedActions: [
          '⚡ Senior Software Architect',
          '🧠 Deep ATS Audit & Keyword Fix',
          '🎨 Lead Product & UX Designer',
          '🎙️ Technical Interview Simulator'
        ]
      }
    ];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [zoomScale, setZoomScale] = useState(0.85);
  const [mobileTab, setMobileTab] = useState<'chat' | 'preview'>('chat');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem('cvpilot_custom_gemini_key') || '');
  const [notification, setNotification] = useState<string | null>(null);
  const [expandedThinkingIds, setExpandedThinkingIds] = useState<Record<string, boolean>>({ msg_welcome: false });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Auto-persist resumeData and messages to localStorage on every change
  useEffect(() => {
    if (!isResumeEmpty) {
      localStorage.setItem('cvpilot_aichat_resume_draft', JSON.stringify(resumeData));
    }
  }, [resumeData, isResumeEmpty]);

  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('cvpilot_aichat_messages_draft', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll chat to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Sync with active resume when saved
  const handleSaveToAccount = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    updateActiveResume(resumeData, currentConfig);
    showToast('✅ Saved CV to your account!');
  };

  const handleOpenInBuilder = () => {
    updateActiveResume(resumeData, currentConfig);
    onNavigateToBuilder(resumeData.templateId);
  };

  const handleExportPDF = () => {
    if (currentConfig.isPremium && !isProMember) {
      openUpgradeModal();
      return;
    }
    window.print();
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const result = await processAIChatTurn(
        [...messages, userMsg],
        text,
        resumeData,
        customApiKey
      );

      // Update resume state
      setResumeData(result.updatedResume);
      
      // Update template if changed
      if (result.updatedResume.templateId && result.updatedResume.templateId !== currentConfig.id) {
        const newConf = getTemplateConfigById(result.updatedResume.templateId);
        setCurrentConfig(newConf);
      }

      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        role: 'assistant',
        content: result.replyMessage,
        timestamp: new Date(),
        updatedSections: result.updatedSections,
        suggestedActions: result.suggestedActions,
        thinkingProcess: result.thinkingProcess,
        atsScore: result.atsScore,
        extractedDataPreview: result.updatedResume
      };

      setMessages(prev => [...prev, assistantMsg]);
      setExpandedThinkingIds(prev => ({ ...prev, [assistantMsg.id]: true }));
      showToast('✨ CV updated in real-time preview!');
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an issue updating your resume. Please try rephrasing your request.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePresetClick = (preset: typeof PRESET_PROMPTS[0]) => {
    handleSendMessage(preset.prompt);
  };

  const handleResetChat = () => {
    if (window.confirm('Start a new chat session? Your current CV canvas will be reset.')) {
      localStorage.removeItem('cvpilot_aichat_resume_draft');
      localStorage.removeItem('cvpilot_aichat_messages_draft');
      setResumeData(getEmptyResumeData());
      setMessages([
        {
          id: 'msg_welcome',
          role: 'assistant',
          content: `### 🧠 Ready for a fresh CV!
Tell me about your career background, paste notes, or pick a preset starter to generate a new resume.`,
          timestamp: new Date(),
          suggestedActions: [
            '⚡ Senior Software Architect',
            '🧠 Deep ATS Audit & Keyword Fix',
            '🎨 Lead Product & UX Designer',
            '🎙️ Technical Interview Simulator'
          ]
        }
      ]);
      showToast('Canvas reset to blank');
    }
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('cvpilot_custom_gemini_key', customApiKey);
    setApiKeyModalOpen(false);
    showToast('🔑 API key saved!');
  };

  const handleTemplateChange = (templateId: string) => {
    const newConfig = getTemplateConfigById(templateId);
    setCurrentConfig(newConfig);
    setResumeData(prev => ({ ...prev, templateId }));
    showToast(`Switched to ${newConfig.name}`);
  };

  const handleColorChange = (hex: string) => {
    setCurrentConfig(prev => ({
      ...prev,
      colorPalette: {
        ...prev.colorPalette,
        primary: hex,
        accent: hex
      }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-gold selection:text-white print:bg-white print:text-black">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900/95 text-white border border-gold/40 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md animate-bounce">
          <span className="material-symbols-outlined text-gold text-base">auto_awesome</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-gold transition-colors font-bold uppercase tracking-wider px-2 py-1 rounded-lg hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Dashboard
          </button>
          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-gold to-amber-300 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
              <span className="material-symbols-outlined text-lg">forum</span>
            </div>
            <div>
              <div className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
                AI CV Copilot
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  LIVE CANVAS
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Natural language interactive CV synthesis</p>
            </div>
          </div>
        </div>

        {/* Center Mobile Tab Switcher */}
        <div className="flex lg:hidden bg-slate-800 p-0.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setMobileTab('chat')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              mobileTab === 'chat' ? 'bg-gold text-navy shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-xs">chat</span>
            Chat
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              mobileTab === 'preview' ? 'bg-gold text-navy shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-xs">visibility</span>
            Live CV
          </button>
        </div>

        {/* Right Top Actions */}
        <div className="flex items-center gap-2">
          {/* Model / Settings button */}
          <button
            onClick={() => setApiKeyModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 font-semibold transition-colors"
            title="Configure AI Model or Custom API Key"
          >
            <span className="material-symbols-outlined text-sm text-amber-400">smart_toy</span>
            <span>{customApiKey ? 'Custom Key Active' : 'Neural Engine'}</span>
          </button>

          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="New Chat"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
          </button>

          <ThemeToggle />

          <button
            onClick={handleOpenInBuilder}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-slate-700 transition-all"
          >
            <span className="material-symbols-outlined text-sm text-gold">edit_note</span>
            <span className="hidden sm:inline">Open in</span> Builder
          </button>

          <button
            onClick={handleExportPDF}
            className="bg-gold hover:bg-amber-500 text-slate-950 font-extrabold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-gold/20 transition-all"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span className="hidden md:inline">Download</span> PDF
          </button>
        </div>
      </header>

      {/* Main Dual-Pane Workspace */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden h-[calc(100vh-57px)]">
        
        {/* LEFT PANE: ChatGPT-like Conversation Interface */}
        <section className={`lg:col-span-6 flex flex-col h-full bg-slate-900/60 border-r border-slate-800 overflow-hidden ${
          mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'
        }`}>
          
          {/* Preset Prompts Bar */}
          <div className="p-3 border-b border-slate-800/80 bg-slate-900/90 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-gold">bolt</span>
              Presets:
            </span>
            {PRESET_PROMPTS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(preset)}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all hover:border-gold/50 flex items-center gap-1"
              >
                <span>{preset.title}</span>
              </button>
            ))}
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 max-w-3xl ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gradient-to-tr from-gold to-amber-400 text-slate-950 shadow-md'
                }`}>
                  <span className="material-symbols-outlined text-base">
                    {msg.role === 'user' ? 'person' : 'smart_toy'}
                  </span>
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col space-y-2 max-w-[85%] ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}>
                  
                  {/* Collapsible Chain-of-Thought Reasoning Box */}
                  {msg.thinkingProcess && msg.thinkingProcess.length > 0 && (
                    <div className="w-full mb-1">
                      <button
                        onClick={() => setExpandedThinkingIds(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-gold transition-colors py-1 px-2.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-gold/40 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[13px] text-amber-400">psychology</span>
                        <span>AI Deep Reasoning Trace ({msg.thinkingProcess.length} steps)</span>
                        <span className="material-symbols-outlined text-[14px]">
                          {expandedThinkingIds[msg.id] ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>

                      {expandedThinkingIds[msg.id] && (
                        <div className="mt-1.5 p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1.5 leading-relaxed">
                          {msg.thinkingProcess.map((step, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-2 text-slate-400">
                              <span className="text-gold font-bold">❯</span>
                              <span className="leading-relaxed">{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ATS Score Tag */}
                  {msg.atsScore !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">verified</span>
                        ATS Readiness: {msg.atsScore}/100 🌟
                      </span>
                    </div>
                  )}

                  <div className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs shadow-md'
                      : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-tl-xs shadow-md'
                  }`}>
                    {/* Render message with rich markdown support */}
                    <div className="space-y-2 text-xs md:text-sm">
                      {msg.content.split('\n\n').map((block, i) => {
                        const trimmed = block.trim();
                        if (trimmed.startsWith('### ')) {
                          return (
                            <h4 key={i} className="font-bold text-sm md:text-base text-gold mt-1 mb-0.5">
                              {trimmed.replace('### ', '')}
                            </h4>
                          );
                        }
                        if (trimmed.startsWith('#### ')) {
                          return (
                            <h5 key={i} className="font-semibold text-xs md:text-sm text-slate-200 mt-1 mb-0.5">
                              {trimmed.replace('#### ', '')}
                            </h5>
                          );
                        }
                        if (trimmed.startsWith('> ')) {
                          return (
                            <blockquote key={i} className="border-l-2 border-gold pl-2.5 py-1 text-slate-300 italic bg-slate-900/40 rounded-r text-xs">
                              {trimmed.replace(/^>\s*(\[!TIP\]\s*)?/i, '')}
                            </blockquote>
                          );
                        }
                        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                          const items = trimmed.split('\n').filter(Boolean);
                          return (
                            <ul key={i} className="space-y-1 pl-1 list-none my-1">
                              {items.map((item, j) => {
                                const clean = item.replace(/^[-*]\s+/, '');
                                // Bold highlighting
                                const parts = clean.split(/(\*\*[^*]+\*\*)/g);
                                return (
                                  <li key={j} className="flex items-start gap-1.5 text-slate-200">
                                    <span className="text-gold mt-0.5 text-xs">•</span>
                                    <span>
                                      {parts.map((p, k) =>
                                        p.startsWith('**') && p.endsWith('**') ? (
                                          <strong key={k} className="text-white font-bold">{p.slice(2, -2)}</strong>
                                        ) : (
                                          p
                                        )
                                      )}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          );
                        }
                        // Regular paragraph with bolding
                        const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
                        return (
                          <p key={i} className="m-0 leading-relaxed text-slate-200">
                            {parts.map((p, k) => (
                              p.startsWith('**') && p.endsWith('**') ? (
                                <strong key={k} className="text-white font-bold">{p.slice(2, -2)}</strong>
                              ) : (
                                <span key={k}>{p}</span>
                              )
                            ))}
                          </p>
                        );
                      })}
                    </div>

                    {/* Updated Sections Badges */}
                    {msg.updatedSections && msg.updatedSections.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-700/60 flex flex-wrap gap-1.5">
                        <span className="text-[10px] text-gold font-bold uppercase tracking-wider w-full">
                          Updated Sections:
                        </span>
                        {msg.updatedSections.map((sec, idx) => (
                          <span
                            key={idx}
                            className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[12px]">check</span>
                            {sec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Suggested Follow-up Action Chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(action)}
                          className="text-[11px] bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-gold border border-slate-700 hover:border-gold/40 px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[12px] text-gold">auto_awesome</span>
                          {action}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-500 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Loader Indicator */}
            {isLoading && (
              <div className="flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-gold to-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-base animate-spin">sync</span>
                </div>
                <div className="bg-slate-800/90 border border-slate-700/80 p-3.5 rounded-2xl rounded-tl-xs flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gold animate-pulse delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-gold animate-pulse delay-200"></div>
                  <span className="text-xs text-slate-400 font-medium ml-1">AI is writing and tailoring your CV...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Box */}
          <div className="p-3 md:p-4 bg-slate-900 border-t border-slate-800">
            <div className="relative bg-slate-800/90 border border-slate-700 rounded-2xl shadow-lg focus-within:border-gold focus-within:ring-1 focus-within:ring-gold transition-all">
              <textarea
                ref={textareaRef}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder="Enter your experience, paste bio, or tell AI what to update (e.g. 'Add React, AWS to skills', 'Make summary punchier')..."
                className="w-full bg-transparent text-white placeholder-slate-400 text-xs md:text-sm p-3.5 pr-20 resize-none outline-none max-h-36"
              />
              <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputPrompt.trim() || isLoading}
                  className="w-8 h-8 rounded-xl bg-gold hover:bg-amber-400 disabled:opacity-30 disabled:hover:bg-gold text-slate-950 flex items-center justify-center transition-all shadow-md"
                  title="Send message (Enter)"
                >
                  <span className="material-symbols-outlined text-base font-bold">arrow_upward</span>
                </button>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 text-center mt-2">
              Tip: Press <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-400 font-mono">Enter</kbd> to submit or <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-400 font-mono">Shift+Enter</kbd> for new line.
            </p>
          </div>

        </section>

        {/* RIGHT PANE: Live CV Canvas Preview */}
        <section className={`lg:col-span-6 flex flex-col h-full bg-slate-950 overflow-hidden ${
          mobileTab === 'chat' ? 'hidden lg:flex' : 'flex'
        }`}>
          
          {/* Canvas Toolbar Controls */}
          <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isResumeEmpty ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {isResumeEmpty ? 'Canvas: Awaiting Career Input' : `Live Preview: ${currentConfig.name}`}
              </span>
              {!isResumeEmpty && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  ATS: {calculateATSScore(resumeData).score}/100
                </span>
              )}
            </div>

            {/* Template Selector & Theme Color Picker */}
            <div className="flex items-center gap-2">
              {/* Quick Template Switcher */}
              <select
                value={resumeData.templateId || 'modern-minimal'}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg px-2 py-1 outline-none"
              >
                {TEMPLATE_PACKS.slice(0, 10).map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name} {tpl.isPremium ? '★ Pro' : ''}
                  </option>
                ))}
              </select>

              {/* Quick Palette Colors */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-800 px-1.5 py-1 rounded-lg border border-slate-700">
                {['#A38048', '#1A2536', '#059669', '#DC2626', '#2563EB'].map((hex) => (
                  <button
                    key={hex}
                    onClick={() => handleColorChange(hex)}
                    style={{ backgroundColor: hex }}
                    className="w-3.5 h-3.5 rounded-full hover:scale-125 transition-transform"
                    title={`Theme ${hex}`}
                  />
                ))}
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs font-bold text-slate-300">
                <button
                  onClick={() => setZoomScale(s => Math.max(0.5, s - 0.1))}
                  className="px-1.5 py-0.5 hover:bg-slate-700 rounded"
                  title="Zoom Out"
                >
                  -
                </button>
                <span className="px-1 text-[10px] font-mono">{Math.round(zoomScale * 100)}%</span>
                <button
                  onClick={() => setZoomScale(s => Math.min(1.3, s + 0.1))}
                  className="px-1.5 py-0.5 hover:bg-slate-700 rounded"
                  title="Zoom In"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleSaveToAccount}
                disabled={isResumeEmpty}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                title="Save CV"
              >
                <span className="material-symbols-outlined text-xs">save</span>
                Save
              </button>
            </div>
          </div>

          {/* Scrollable Document Canvas */}
          <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start bg-slate-950/80">
            {isResumeEmpty ? (
              <div className="flex flex-col items-center justify-center min-h-[520px] w-full max-w-md mx-auto text-center p-8 my-auto border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30 backdrop-blur-sm animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-gold/20 to-amber-400/20 border border-gold/40 flex items-center justify-center mb-4 text-gold shadow-lg shadow-gold/10">
                  <span className="material-symbols-outlined text-3xl animate-pulse">edit_document</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Live CV Canvas Ready</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mb-6">
                  Chat with the AI Copilot on the left or paste your career notes. Your professional, ATS-optimized CV will generate right here in real-time.
                </p>
                <div className="flex flex-col gap-2 w-full">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                    Or try a 1-click starter preset:
                  </span>
                  {PRESET_PROMPTS.slice(0, 3).map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(p.prompt)}
                      className="w-full text-left px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 hover:border-gold/40 text-slate-200 text-xs font-semibold transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-xs text-gold group-hover:scale-110 transition-transform">bolt</span>
                        <span>{p.title}</span>
                      </div>
                      <span className="material-symbols-outlined text-xs text-slate-500 group-hover:text-gold transition-colors">arrow_forward</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div
                id="resume-document"
                className="bg-white shadow-2xl rounded-lg overflow-hidden transition-transform duration-150 origin-top animate-fade-in"
                style={{
                  width: '794px',
                  minHeight: '1123px',
                  transform: `scale(${zoomScale})`,
                  transformOrigin: 'top center'
                }}
              >
                <TemplateEngine data={resumeData} config={currentConfig} zoomScale={1.0} />
              </div>
            )}
          </div>

        </section>

      </main>

      {/* API Key / Model Settings Modal */}
      {apiKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400">tune</span>
                AI Model & API Settings
              </h3>
              <button
                onClick={() => setApiKeyModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                CV PILOT provides an **instant built-in Neural Resume Engine** with zero setup required.
              </p>
              <p>
                Optionally, you can connect your own **Google Gemini API Key** for enhanced deep conversational generation.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Custom Google Gemini API Key (Optional)
                </label>
                <input
                  type="password"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-gold"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Stored securely in your browser's local storage.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setApiKeyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 rounded-xl bg-gold hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Library Modal */}
      <TemplateLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectTemplateConfig={(cfg) => {
          setCurrentConfig(cfg);
          setResumeData(prev => ({ ...prev, templateId: cfg.id }));
        }}
        selectedTemplateId={resumeData.templateId}
      />

      <UpgradeModal />
    </div>
  );
};
