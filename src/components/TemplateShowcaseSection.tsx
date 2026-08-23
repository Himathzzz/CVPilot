import React, { useState } from 'react';
import type { ResumeTemplateId } from '../types/resume';

interface TemplateShowcaseProps {
  onSelectTemplate: (templateId: ResumeTemplateId) => void;
}

interface TemplateItem {
  id: ResumeTemplateId;
  name: string;
  category: 'Modern' | 'Professional' | 'Executive' | 'Creative' | 'ATS-Clean';
  description: string;
  colorScheme: string;
  atsScore: string;
  badge?: string;
}

export const TemplateShowcaseSection: React.FC<TemplateShowcaseProps> = ({ onSelectTemplate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const templates: TemplateItem[] = [
    {
      id: 'modern',
      name: 'Resumaker Modern',
      category: 'Modern',
      description: 'Clean two-column header layout with indigo accents, perfect for tech & corporate roles.',
      colorScheme: 'from-blue-600 to-indigo-700',
      atsScore: '98%',
      badge: 'Popular'
    },
    {
      id: 'modern-minimal',
      name: 'Minimalist Executive',
      category: 'ATS-Clean',
      description: 'High readability, single-column architecture tailored specifically for ATS screening engines.',
      colorScheme: 'from-slate-700 to-slate-900',
      atsScore: '100%',
      badge: 'Best ATS Pass'
    },
    {
      id: 'executive',
      name: 'Stanford Executive',
      category: 'Executive',
      description: 'Sophisticated typography and structured section hierarchy ideal for leadership positions.',
      colorScheme: 'from-amber-600 to-amber-900',
      atsScore: '96%',
      badge: 'Leadership'
    },
    {
      id: 'creative',
      name: 'Creative Studio',
      category: 'Creative',
      description: 'Vibrant side panel layout highlighting key skills, languages, and featured projects.',
      colorScheme: 'from-purple-600 to-pink-600',
      atsScore: '94%'
    },
    {
      id: 'technical',
      name: 'Tech Stack Developer',
      category: 'Professional',
      description: 'Emphasizes technical skills, repository links, certifications, and project metrics.',
      colorScheme: 'from-emerald-600 to-teal-800',
      atsScore: '99%'
    },
    {
      id: 'compact',
      name: 'Compact One-Page',
      category: 'ATS-Clean',
      description: 'Optimized spacing for dense professional histories while retaining high visual clarity.',
      colorScheme: 'from-sky-600 to-cyan-800',
      atsScore: '97%'
    }
  ];

  const categories = ['All', 'Modern', 'ATS-Clean', 'Executive', 'Creative', 'Professional'];

  const filteredTemplates = activeCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  return (
    <section id="templates" className="py-20 px-4 md:px-12 max-w-7xl mx-auto bg-slate-50/50 dark:bg-slate-900/40 rounded-3xl my-12 border border-slate-200/60 dark:border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Handcrafted <span className="text-blue-600 dark:text-blue-400">ATS-Ready</span> Templates
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg">
          Designed alongside HR professionals to ensure flawless keyword extraction across all major hiring software.
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map((template) => (
          <div 
            key={template.id}
            className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Card Top Preview Header */}
            <div className="p-6 relative overflow-hidden bg-slate-100 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 min-h-[220px] flex flex-col justify-between">
              <div className="flex justify-between items-center z-10">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur-sm">
                  {template.category}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span> ATS {template.atsScore}
                </span>
              </div>

              {/* Dynamic Abstract Resume Mockup Line graphic */}
              <div className="my-6 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md space-y-2 group-hover:scale-105 transition-transform">
                <div className={`h-3 rounded w-3/4 bg-gradient-to-r ${template.colorScheme}`}></div>
                <div className="h-2 rounded w-1/2 bg-slate-200 dark:bg-slate-700"></div>
                <div className="pt-2 space-y-1">
                  <div className="h-1.5 rounded w-full bg-slate-100 dark:bg-slate-700"></div>
                  <div className="h-1.5 rounded w-5/6 bg-slate-100 dark:bg-slate-700"></div>
                  <div className="h-1.5 rounded w-4/6 bg-slate-100 dark:bg-slate-700"></div>
                </div>
              </div>

              {template.badge && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm">
                  {template.badge}
                </div>
              )}
            </div>

            {/* Card Content & Action */}
            <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {template.description}
                </p>
              </div>

              <button
                onClick={() => onSelectTemplate(template.id)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
              >
                <span className="material-symbols-outlined text-sm">edit_document</span>
                Use This Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
