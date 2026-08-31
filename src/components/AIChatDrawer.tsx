import React, { useState, useRef, useEffect } from 'react';
import type { ResumeData } from '../types/resume';
import { processAIChatTurn, type ChatMessage } from '../services/aiChatService';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  onUpdateResumeData: (data: ResumeData) => void;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  resumeData,
  onUpdateResumeData
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'drawer_welcome',
      role: 'assistant',
      content: `### 🤖 AI Resume Copilot
I'm here to help you refine your resume! You can ask me to:
- **"Make my summary punchier and more executive"**
- **"Add quantifiable metrics to my bullet points"**
- **"Suggest 5 hot skills for ${resumeData.personalInfo.jobTitle || 'my role'}"**
- **"Add a new experience at Google as Staff Engineer"**`,
      timestamp: new Date(),
      suggestedActions: [
        '✨ Enhance my summary',
        '📈 Add metrics to experience',
        '💡 Suggest in-demand skills',
        '⚡ Fix formatting & ATS score'
      ]
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputPrompt).trim();
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
      const customKey = localStorage.getItem('cvpilot_custom_gemini_key') || undefined;
      const result = await processAIChatTurn(
        [...messages, userMsg],
        text,
        resumeData,
        customKey
      );

      onUpdateResumeData(result.updatedResume);

      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        role: 'assistant',
        content: result.replyMessage,
        timestamp: new Date(),
        updatedSections: result.updatedSections,
        suggestedActions: result.suggestedActions,
        thinkingProcess: result.thinkingProcess,
        atsScore: result.atsScore
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an issue updating your resume. Please try again.',
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

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col transition-all duration-300 font-sans text-slate-100">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-gold to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md">
            <span className="material-symbols-outlined text-lg">smart_toy</span>
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
              AI Copilot
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                Connected
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">Edits apply live to your builder</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Close Copilot"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col space-y-1.5 ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[90%] ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-xs shadow-md'
                : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-tl-xs shadow-md'
            }`}>
              <div className="space-y-1.5">
                {msg.content.split('\n\n').map((block, i) => {
                  const trimmed = block.trim();
                  if (trimmed.startsWith('### ')) {
                    return <h4 key={i} className="font-bold text-xs text-gold mt-1 mb-0.5">{trimmed.replace('### ', '')}</h4>;
                  }
                  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    return (
                      <ul key={i} className="space-y-0.5 pl-1 list-none my-1">
                        {trimmed.split('\n').filter(Boolean).map((it, j) => (
                          <li key={j} className="flex items-start gap-1 text-slate-200">
                            <span className="text-gold">•</span>
                            <span>{it.replace(/^[-*]\s+/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={i} className="m-0 leading-relaxed text-slate-200">{trimmed.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
                })}
              </div>

              {/* Updated Section Badges */}
              {msg.updatedSections && msg.updatedSections.length > 0 && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-700/60 flex flex-wrap gap-1">
                  {msg.updatedSections.map((sec, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[10px]">check</span>
                      {sec}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Suggested Follow-up Actions */}
            {msg.suggestedActions && msg.suggestedActions.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {msg.suggestedActions.map((act, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(act)}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-gold border border-slate-700 px-2 py-1 rounded-full font-medium transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[11px] text-gold">auto_awesome</span>
                    {act}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs text-slate-300">
            <span className="material-symbols-outlined text-gold animate-spin text-sm">sync</span>
            <span>AI Copilot is updating your resume...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Drawer Input */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <div className="relative bg-slate-800/90 border border-slate-700 rounded-xl focus-within:border-gold transition-all">
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="Tell AI what to update (e.g. 'Add Docker to skills', 'Make bullets stronger')..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-xs p-3 pr-10 resize-none outline-none"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputPrompt.trim() || isLoading}
            className="absolute right-2 bottom-2 w-7 h-7 rounded-lg bg-gold hover:bg-amber-400 disabled:opacity-30 text-slate-950 flex items-center justify-center transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm font-bold">arrow_upward</span>
          </button>
        </div>
      </div>

    </div>
  );
};
