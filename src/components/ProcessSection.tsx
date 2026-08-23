import React from 'react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Pick a Designer Template',
      description: 'Choose from HR-approved, ATS-tested templates crafted for your specific industry and career level.',
      icon: 'dashboard_customize',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      number: '02',
      title: 'Fill with AI Smart Assistance',
      description: 'Input your experience or let our AI writer auto-generate impact-driven bullet points tailored to your role.',
      icon: 'auto_awesome',
      color: 'from-amber-500 to-orange-600'
    },
    {
      number: '03',
      title: 'Download & Get Hired',
      description: 'Export clean, pixel-perfect PDF files instantly and apply to top companies with complete confidence.',
      icon: 'download_for_offline',
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  return (
    <section id="process" className="py-20 px-4 md:px-12 max-w-7xl mx-auto border-t border-slate-200/60 dark:border-slate-800">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Build Your Resume in <span className="text-blue-600 dark:text-blue-400">3 Easy Steps</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg">
          No design skills required. Our Resumaker AI assistant guides you through every step of the process.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((step, idx) => (
          <div 
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-lg`}>
                  <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                </div>
                <span className="text-4xl font-black text-slate-200 dark:text-slate-800 font-mono">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Step {step.number} of 03
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
