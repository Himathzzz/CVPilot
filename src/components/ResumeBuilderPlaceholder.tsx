import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const ResumeBuilderPlaceholder: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const { user, logout } = useAuth();

  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.displayName || 'Jane Doe',
    jobTitle: 'Senior Software Engineer',
    email: user?.email || 'jane@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    summary: 'Architecting high-performance scalable software systems and leading cross-functional engineering teams.',
  });

  const [experienceList, setExperienceList] = useState([
    {
      company: 'TechCorp Solutions',
      role: 'Staff Architect',
      period: '2022 - Present',
      description: 'Spearheaded cloud migration reduces latency by 40%. Managed a team of 12 senior engineers.',
    },
    {
      company: 'DataFlow Systems',
      role: 'Software Engineer',
      period: '2019 - 2022',
      description: 'Designed real-time event-streaming pipelines handling over 5M events daily.',
    }
  ]);

  const [skills, setSkills] = useState('TypeScript, React, Node.js, Python, PostgreSQL, AWS, Firebase, System Design');

  return (
    <div className="min-h-screen bg-background text-navy font-sans flex flex-col">
      {/* Workspace Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-outline-variant px-margin-mobile md:px-margin-desktop py-sm flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-md">
          <button 
            onClick={onBackToHome}
            className="flex items-center gap-xs font-label-caps text-label-caps text-navy hover:text-gold transition-colors font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Dashboard
          </button>
          <div className="h-4 w-[1px] bg-outline-variant hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="CV PILOT Logo" className="h-8 w-auto object-contain" />
            <span className="font-display text-lg font-bold text-navy uppercase tracking-wider hidden sm:inline">
              CV PILOT Builder
            </span>
          </div>
        </div>

        <div className="flex items-center gap-md">
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-sans text-xs font-bold text-navy">{user?.displayName || 'Pilot User'}</span>
            <span className="font-caption text-caption text-on-surface-variant">{user?.email}</span>
          </div>
          <button 
            onClick={logout}
            className="bg-transparent border border-outline-variant text-navy hover:border-gold hover:text-gold px-md py-1.5 font-label-caps text-label-caps uppercase transition-colors rounded"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Workspace Editor Grid */}
      <main className="flex-grow layout-grid max-w-max-width w-full mx-auto py-lg gap-gutter">
        {/* Left Column: Structured Form Input */}
        <div className="col-span-4 md:col-span-6 flex flex-col gap-lg">
          <div className="wireframe-border p-md bg-white rounded shadow-xs">
            <h2 className="font-label-caps text-label-caps text-navy font-bold uppercase mb-md border-b border-outline-variant pb-xs flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px] text-gold">person</span>
              01. Personal & Contact Info
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <div>
                <label className="form-label">Full Name</label>
                <input 
                  className="form-input" 
                  value={personalInfo.fullName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Target Job Title</label>
                <input 
                  className="form-input" 
                  value={personalInfo.jobTitle}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, jobTitle: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input 
                  className="form-input" 
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Location</label>
                <input 
                  className="form-input" 
                  value={personalInfo.location}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-md">
              <label className="form-label">Professional Summary</label>
              <textarea 
                className="form-input h-24"
                value={personalInfo.summary}
                onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
              />
            </div>
          </div>

          <div className="wireframe-border p-md bg-white rounded shadow-xs">
            <h2 className="font-label-caps text-label-caps text-navy font-bold uppercase mb-md border-b border-outline-variant pb-xs flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px] text-gold">work</span>
              02. Professional History & Experience
            </h2>
            {experienceList.map((exp, index) => (
              <div key={index} className="border border-outline-variant p-sm mb-sm bg-surface-container-low rounded">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm mb-xs">
                  <input 
                    className="form-input font-bold bg-white" 
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...experienceList];
                      updated[index].company = e.target.value;
                      setExperienceList(updated);
                    }}
                  />
                  <input 
                    className="form-input bg-white" 
                    value={exp.role}
                    onChange={(e) => {
                      const updated = [...experienceList];
                      updated[index].role = e.target.value;
                      setExperienceList(updated);
                    }}
                  />
                  <input 
                    className="form-input bg-white" 
                    value={exp.period}
                    onChange={(e) => {
                      const updated = [...experienceList];
                      updated[index].period = e.target.value;
                      setExperienceList(updated);
                    }}
                  />
                </div>
                <textarea 
                  className="form-input h-16 bg-white"
                  value={exp.description}
                  onChange={(e) => {
                    const updated = [...experienceList];
                    updated[index].description = e.target.value;
                    setExperienceList(updated);
                  }}
                />
              </div>
            ))}
          </div>

          <div className="wireframe-border p-md bg-white rounded shadow-xs">
            <h2 className="font-label-caps text-label-caps text-navy font-bold uppercase mb-md border-b border-outline-variant pb-xs flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px] text-gold">code</span>
              03. Core Competencies & Skills
            </h2>
            <input 
              className="form-input"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
        </div>

        {/* Right Column: Live Minimalist Resume Blueprint Preview */}
        <div className="col-span-4 md:col-span-6 sticky top-20 flex flex-col gap-md">
          <div className="flex justify-between items-center">
            <span className="font-label-caps text-label-caps text-navy font-bold uppercase tracking-wider">
              Live Structural Preview
            </span>
            <button className="bg-navy hover:bg-[#242f45] text-white px-md py-2 font-label-caps text-label-caps uppercase flex items-center gap-xs transition-colors rounded shadow-xs border border-navy">
              <span className="material-symbols-outlined text-[16px] text-gold">file_download</span>
              Export PDF
            </button>
          </div>

          {/* Minimalist Resume Page Document */}
          <div className="wireframe-border bg-white text-navy p-xl shadow-xl aspect-[1/1.414] overflow-y-auto flex flex-col gap-lg font-sans border-t-4 border-t-gold">
            {/* Header */}
            <div className="border-b border-navy pb-md">
              <h1 className="text-3xl font-extrabold tracking-tight uppercase text-navy">{personalInfo.fullName || 'YOUR NAME'}</h1>
              <div className="text-sm font-semibold tracking-wide text-gold mt-xs uppercase">{personalInfo.jobTitle}</div>
              <div className="text-xs font-sans text-on-surface-variant mt-xs flex gap-md">
                <span>{personalInfo.email}</span>
                <span>•</span>
                <span>{personalInfo.location}</span>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-xs text-navy">Summary</div>
              <p className="text-sm leading-relaxed text-navy">{personalInfo.summary}</p>
            </div>

            {/* Experience */}
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-sm text-navy border-b border-outline-variant pb-xs">
                Experience
              </div>
              <div className="flex flex-col gap-md">
                {experienceList.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-sm text-navy">{exp.company}</span>
                      <span className="text-xs text-on-surface-variant">{exp.period}</span>
                    </div>
                    <div className="text-xs italic text-gold font-semibold mb-xs">{exp.role}</div>
                    <p className="text-xs text-navy leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-xs text-navy border-b border-outline-variant pb-xs">
                Skills & Technologies
              </div>
              <div className="text-xs text-navy leading-relaxed">
                {skills}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
