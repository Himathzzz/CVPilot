import React from 'react';

export const AIFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: 'auto_awesome',
      badge: 'AI Assistant',
      title: 'AI Resume Writer & Bullet Enhancer',
      description: 'Generate tailored summary statements and action-oriented bullet points calibrated for your specific target job title.',
      gradient: 'from-blue-600 to-indigo-600',
      bgGlow: 'bg-blue-500/10'
    },
    {
      icon: 'verified',
      badge: '99% ATS Pass Rate',
      title: 'Built-in ATS Optimization Engine',
      description: 'Scans your resume against top hiring systems (Workday, Greenhouse, Lever) to ensure 100% keyword parsing accuracy.',
      gradient: 'from-amber-500 to-orange-600',
      bgGlow: 'bg-amber-500/10'
    },
    {
      icon: 'palette',
      badge: 'Designer Templates',
      title: '1-Click Formatting & Layout Packs',
      description: 'Choose from 8+ HR-approved modern templates with custom color schemes, typography controls, and section order.',
      gradient: 'from-emerald-500 to-teal-600',
      bgGlow: 'bg-emerald-500/10'
    },
    {
      icon: 'download',
      badge: 'PDF & Word Export',
      title: 'Instant Multi-Format Download',
      description: 'Export clean pixel-perfect PDF documents ready for instant submission to job portals and recruiters.',
      gradient: 'from-purple-600 to-pink-600',
      bgGlow: 'bg-purple-500/10'
    }
  ];

  return (
    <section id="features" className="py-20 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Everything You Need to Land <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500">More Interviews</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg">
          Resumaker-inspired intelligent tools designed to cut job application time in half while maximizing recruiter response rates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, idx) => (
          <div 
            key={idx}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${feat.gradient} shadow-md mb-5 group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-2xl">{feat.icon}</span>
              </div>
              <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide mb-3 ${feat.bgGlow} text-slate-700 dark:text-slate-300`}>
                {feat.badge}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {feat.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {feat.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
              Learn how it works <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
