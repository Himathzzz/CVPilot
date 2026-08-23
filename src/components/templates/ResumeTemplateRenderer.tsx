import React from 'react';
import type { ResumeData } from '../../types/resume';
import { getTemplateById } from '../../data/templatesCatalog';
import type { TemplateDefinition } from '../../data/templatesCatalog';

interface TemplateProps {
  data: ResumeData;
  templateDef?: TemplateDefinition;
}

/* 1. Modern Minimalist */
const ModernTemplate: React.FC<TemplateProps> = ({ data, templateDef }) => {
  const { personalInfo, experiences, skillCategories } = data;
  const accent = templateDef?.accentColor || '#A38048';

  return (
    <div className="bg-white text-navy p-8 md:p-10 min-h-full font-sans flex flex-col gap-6 text-sm border-t-4" style={{ borderTopColor: accent }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-5">
        <div className="flex items-center gap-4">
          {personalInfo.showPhoto && personalInfo.photoUrl && (
            <img src={personalInfo.photoUrl} alt={personalInfo.fullName} className="w-20 h-20 rounded-full object-cover border-2 border-outline-variant shadow-xs shrink-0" />
          )}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-navy uppercase leading-none">{personalInfo.fullName || 'YOUR NAME'}</h1>
            <div className="text-base font-semibold tracking-wide mt-1.5 uppercase" style={{ color: accent }}>{personalInfo.jobTitle || 'TARGET JOB TITLE'}</div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 mt-2 font-medium">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>• {personalInfo.phone}</span>}
              {personalInfo.location && <span>• {personalInfo.location}</span>}
            </div>
          </div>
        </div>
      </div>
      {personalInfo.summary && (
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-widest mb-1.5 flex items-center gap-2" style={{ color: accent }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-xs md:text-sm">{personalInfo.summary}</p>
        </div>
      )}
      {experiences.length > 0 && (
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-gray-200 pb-1" style={{ color: accent }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
            Professional History
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-navy text-sm">{exp.company}</span>
                  <span className="text-xs text-gray-500 font-medium">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-xs font-semibold mb-1" style={{ color: accent }}>{exp.role}</div>
                {exp.description && <p className="text-xs text-gray-700 mb-1.5 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      {skillCategories.length > 0 && (
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-widest mb-2 flex items-center gap-2 border-b border-gray-200 pb-1" style={{ color: accent }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
            Core Competencies & Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skillCategories.map((cat) => (
              <div key={cat.id}>
                <span className="text-xs font-bold text-navy uppercase block mb-1">{cat.categoryName}:</span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded font-medium text-navy border" style={{ borderColor: accent, backgroundColor: `${accent}15` }}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* 2. Executive Luxe */
const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, templateDef }) => {
  const { personalInfo, experiences } = data;
  const accent = templateDef?.accentColor || '#1B2A4A';

  return (
    <div className="bg-white text-navy min-h-full font-serif flex flex-col text-sm shadow-sm">
      <div className="p-8 text-white flex flex-col md:flex-row justify-between items-center gap-4" style={{ backgroundColor: accent }}>
        <div className="flex items-center gap-5">
          {personalInfo.showPhoto && personalInfo.photoUrl && (
            <img src={personalInfo.photoUrl} alt={personalInfo.fullName} className="w-24 h-24 rounded shadow-md border-2 border-white object-cover shrink-0" />
          )}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase font-sans">{personalInfo.fullName || 'YOUR NAME'}</h1>
            <div className="font-sans font-semibold tracking-widest uppercase text-sm mt-1 text-gold">{personalInfo.jobTitle || 'EXECUTIVE LEADER'}</div>
          </div>
        </div>
        <div className="text-xs font-sans text-gray-200 space-y-1 text-left md:text-right border-t md:border-t-0 md:border-l border-white/20 pt-3 md:pt-0 md:pl-4">
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
        </div>
      </div>
      <div className="p-8 md:p-10 space-y-6">
        {personalInfo.summary && (
          <div className="border-b border-gray-200 pb-5">
            <h2 className="font-sans text-xs font-bold uppercase tracking-widest text-navy mb-2">Executive Summary</h2>
            <p className="text-gray-800 leading-relaxed italic text-sm md:text-base">"{personalInfo.summary}"</p>
          </div>
        )}
        {experiences.length > 0 && (
          <div>
            <h2 className="font-sans text-xs font-extrabold uppercase tracking-widest text-navy border-b-2 pb-1 mb-4" style={{ borderColor: accent }}>Leadership Experience</h2>
            <div className="space-y-5">
              {experiences.map((exp) => (
                <div key={exp.id} className="font-sans">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-base text-navy">{exp.company}</span>
                    <span className="text-xs text-gray-500 font-semibold">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accent }}>{exp.role}</div>
                  <p className="text-xs text-gray-700 leading-relaxed font-serif mb-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* 3. Creative Left Sidebar */
const CreativeTemplate: React.FC<TemplateProps> = ({ data, templateDef }) => {
  const { personalInfo, experiences } = data;
  const accent = templateDef?.accentColor || '#0d9488';

  return (
    <div className="bg-white text-navy min-h-full font-sans grid grid-cols-1 md:grid-cols-12 text-sm border">
      <div className="md:col-span-4 bg-gray-900 text-white p-6 md:p-8 flex flex-col justify-between gap-6">
        <div className="space-y-6">
          {personalInfo.showPhoto && personalInfo.photoUrl && (
            <img src={personalInfo.photoUrl} alt={personalInfo.fullName} className="w-28 h-28 rounded-xl object-cover border-2 mx-auto shadow-md" style={{ borderColor: accent }} />
          )}
          <div className="text-center">
            <h1 className="text-xl font-bold uppercase tracking-tight text-white">{personalInfo.fullName || 'YOUR NAME'}</h1>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: accent }}>{personalInfo.jobTitle}</p>
          </div>
          <div className="border-t border-gray-800 pt-4 space-y-2 text-xs text-gray-300">
            {personalInfo.email && <div className="truncate">✉ {personalInfo.email}</div>}
            {personalInfo.phone && <div>📞 {personalInfo.phone}</div>}
            {personalInfo.location && <div>📍 {personalInfo.location}</div>}
          </div>
        </div>
      </div>
      <div className="md:col-span-8 p-6 md:p-8 space-y-6 bg-white">
        {personalInfo.summary && (
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-navy border-b border-gray-200 pb-1 mb-2">Profile Summary</h2>
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}
        {experiences.length > 0 && (
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-navy border-b border-gray-200 pb-1 mb-3">Work Experience</h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: accent }}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-navy text-sm">{exp.company}</span>
                    <span className="text-xs font-semibold" style={{ color: accent }}>{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-xs font-semibold text-gray-700 mb-1">{exp.role}</div>
                  <p className="text-xs text-gray-600 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* 4. Compact ATS */
const CompactTemplate: React.FC<TemplateProps> = ({ data, templateDef }) => {
  const { personalInfo, experiences } = data;
  const accent = templateDef?.accentColor || '#1A2536';

  return (
    <div className="bg-white text-gray-900 p-6 md:p-8 min-h-full font-sans text-xs space-y-4">
      <div className="text-center border-b-2 pb-3" style={{ borderColor: accent }}>
        <h1 className="text-2xl font-black uppercase text-gray-900 tracking-wide">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <div className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: accent }}>{personalInfo.jobTitle}</div>
        <div className="text-[11px] text-gray-600 flex justify-center flex-wrap gap-2 mt-1">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.email && <span>| {personalInfo.email}</span>}
        </div>
      </div>
      {personalInfo.summary && (
        <div>
          <h2 className="font-bold uppercase text-[11px] tracking-wider text-gray-900 border-b border-gray-300 pb-0.5 mb-1">Summary</h2>
          <p className="text-gray-800 leading-snug">{personalInfo.summary}</p>
        </div>
      )}
      {experiences.length > 0 && (
        <div>
          <h2 className="font-bold uppercase text-[11px] tracking-wider text-gray-900 border-b border-gray-300 pb-0.5 mb-2">Professional Experience</h2>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold text-gray-900">
                  <span>{exp.company} – {exp.role}</span>
                  <span className="text-gray-500 font-normal">{exp.startDate} – {exp.endDate}</span>
                </div>
                <p className="text-gray-700 leading-snug mt-0.5">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* 5. Timeline Layout */
const TimelineTemplate: React.FC<TemplateProps> = ({ data, templateDef }) => {
  const { personalInfo, experiences } = data;
  const accent = templateDef?.accentColor || '#7c3aed';

  return (
    <div className="bg-white text-gray-900 p-8 min-h-full font-sans text-xs space-y-6">
      <div className="border-l-4 pl-4" style={{ borderColor: accent }}>
        <h1 className="text-3xl font-extrabold uppercase text-gray-900">{personalInfo.fullName}</h1>
        <div className="text-sm font-bold uppercase tracking-wider mt-1" style={{ color: accent }}>{personalInfo.jobTitle}</div>
        <div className="text-gray-600 text-xs mt-1">{personalInfo.email} • {personalInfo.location}</div>
      </div>
      {experiences.length > 0 && (
        <div>
          <h2 className="font-extrabold uppercase tracking-widest text-xs mb-4" style={{ color: accent }}>Career Timeline</h2>
          <div className="space-y-4 border-l-2 ml-2 pl-4" style={{ borderColor: `${accent}40` }}>
            {experiences.map((exp) => (
              <div key={exp.id} className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }}></div>
                <div className="font-bold text-sm text-gray-900">{exp.company}</div>
                <div className="text-xs font-semibold" style={{ color: accent }}>{exp.role} ({exp.startDate} - {exp.endDate})</div>
                <p className="text-gray-700 mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* 6. Tech Matrix Layout */
const TechMatrixTemplate: React.FC<TemplateProps> = ({ data, templateDef }) => {
  const { personalInfo, experiences, skillCategories } = data;
  const accent = templateDef?.accentColor || '#059669';

  return (
    <div className="bg-gray-950 text-gray-100 p-8 min-h-full font-mono text-xs space-y-6">
      <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white">{personalInfo.fullName}</h1>
          <div className="text-xs font-bold mt-1" style={{ color: accent }}>&gt; {personalInfo.jobTitle}</div>
        </div>
        <div className="text-right text-[11px] text-gray-400">
          <div>{personalInfo.email}</div>
          <div>{personalInfo.location}</div>
        </div>
      </div>
      {skillCategories.length > 0 && (
        <div className="bg-gray-900 p-4 rounded border border-gray-800">
          <h2 className="text-xs font-bold text-white uppercase mb-2">// Tech Stack & Skills</h2>
          <div className="grid grid-cols-2 gap-2">
            {skillCategories.map((cat) => (
              <div key={cat.id}>
                <span className="text-gray-400 font-bold">{cat.categoryName}: </span>
                <span className="text-gray-200">{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {experiences.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-white uppercase">// Work History</h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="border-l-2 p-3 bg-gray-900/50 rounded-r" style={{ borderColor: accent }}>
              <div className="flex justify-between font-bold">
                <span className="text-white">{exp.company}</span>
                <span className="text-gray-400">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="text-xs" style={{ color: accent }}>{exp.role}</div>
              <p className="text-gray-300 mt-1 text-[11px]">{exp.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* 7. Academic Research Layout */
const AcademicTemplate: React.FC<TemplateProps> = ({ data, templateDef }) => {
  const { personalInfo, education } = data;
  const accent = templateDef?.accentColor || '#1B2A4A';

  return (
    <div className="bg-white text-gray-900 p-8 min-h-full font-serif text-xs space-y-5">
      <div className="text-center border-b pb-4" style={{ borderColor: accent }}>
        <h1 className="text-3xl font-bold uppercase tracking-widest">{personalInfo.fullName}</h1>
        <div className="text-xs italic mt-1" style={{ color: accent }}>{personalInfo.jobTitle}</div>
        <div className="text-[11px] text-gray-600 mt-1">{personalInfo.email} • {personalInfo.location}</div>
      </div>
      {personalInfo.summary && (
        <div>
          <h2 className="font-bold text-xs uppercase tracking-wider mb-1" style={{ color: accent }}>Research Overview</h2>
          <p className="text-gray-800 leading-relaxed font-sans">{personalInfo.summary}</p>
        </div>
      )}
      {education.length > 0 && (
        <div>
          <h2 className="font-bold text-xs uppercase tracking-wider mb-2 border-b" style={{ color: accent }}>Academic Qualifications</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="font-bold text-gray-900">{edu.degree} in {edu.fieldOfStudy}</div>
              <div className="text-gray-600">{edu.institution} ({edu.startDate} - {edu.endDate})</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* 8. Minimal Centered Layout */
const MinimalCenteredTemplate: React.FC<TemplateProps> = ({ data, templateDef }) => {
  const { personalInfo, experiences } = data;
  const accent = templateDef?.accentColor || '#A38048';

  return (
    <div className="bg-white text-gray-900 p-10 min-h-full font-sans text-xs space-y-6 text-center">
      <div className="space-y-1">
        <h1 className="text-3xl font-light uppercase tracking-widest">{personalInfo.fullName}</h1>
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>{personalInfo.jobTitle}</div>
        <div className="text-[11px] text-gray-500">{personalInfo.email} • {personalInfo.location}</div>
      </div>
      <div className="w-12 h-[2px] mx-auto" style={{ backgroundColor: accent }}></div>
      {personalInfo.summary && <p className="text-gray-700 max-w-lg mx-auto leading-relaxed">{personalInfo.summary}</p>}
      {experiences.length > 0 && (
        <div className="text-left space-y-4 max-w-xl mx-auto">
          <h2 className="text-center font-bold uppercase tracking-widest text-xs" style={{ color: accent }}>Experience</h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="border-b pb-3">
              <div className="flex justify-between font-bold">
                <span>{exp.company}</span>
                <span className="text-gray-500 font-normal">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="text-xs italic" style={{ color: accent }}>{exp.role}</div>
              <p className="text-gray-600 mt-1">{exp.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* 9. Sidebar Right Layout */
const SidebarRightTemplate: React.FC<TemplateProps> = ({ data, templateDef }) => {
  const { personalInfo, experiences, skillCategories } = data;
  const accent = templateDef?.accentColor || '#2563eb';

  return (
    <div className="bg-white text-gray-900 min-h-full font-sans text-xs grid grid-cols-12 border">
      <div className="col-span-8 p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-navy uppercase">{personalInfo.fullName}</h1>
          <div className="text-sm font-bold mt-1" style={{ color: accent }}>{personalInfo.jobTitle}</div>
          <p className="text-gray-700 mt-3">{personalInfo.summary}</p>
        </div>
        {experiences.length > 0 && (
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider mb-3 border-b pb-1" style={{ color: accent }}>Work History</h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="font-bold text-sm">{exp.company}</div>
                  <div className="text-xs font-semibold" style={{ color: accent }}>{exp.role}</div>
                  <p className="text-gray-600 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="col-span-4 bg-gray-100 p-6 space-y-4 border-l">
        <h3 className="font-bold text-xs uppercase" style={{ color: accent }}>Contact</h3>
        <div className="text-[11px] text-gray-700 space-y-1">
          <div>{personalInfo.email}</div>
          <div>{personalInfo.location}</div>
        </div>
        {skillCategories.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase" style={{ color: accent }}>Skills</h3>
            {skillCategories.map((cat) => (
              <div key={cat.id}>
                <div className="font-bold text-[11px]">{cat.categoryName}</div>
                <div className="text-[10px] text-gray-600">{cat.skills.join(', ')}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* 10. Gradient Modern Layout */
const GradientTemplate: React.FC<TemplateProps> = ({ data, templateDef }) => {
  const { personalInfo, experiences } = data;
  const accent = templateDef?.accentColor || '#dc2626';

  return (
    <div className="bg-white text-navy min-h-full font-sans text-xs space-y-6">
      <div className="p-8 text-white rounded-b-xl shadow-md" style={{ background: `linear-gradient(135deg, #1B2A4A 0%, ${accent} 100%)` }}>
        <h1 className="text-3xl font-extrabold uppercase">{personalInfo.fullName}</h1>
        <div className="text-sm font-semibold tracking-wider opacity-90 mt-1">{personalInfo.jobTitle}</div>
        <div className="text-xs opacity-80 mt-2">{personalInfo.email} • {personalInfo.location}</div>
      </div>
      <div className="p-8 pt-0 space-y-5">
        {personalInfo.summary && (
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <p className="text-gray-800">{personalInfo.summary}</p>
          </div>
        )}
        {experiences.length > 0 && (
          <div>
            <h2 className="font-extrabold text-xs uppercase tracking-wider mb-3" style={{ color: accent }}>Experience</h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="p-3 border border-gray-200 rounded shadow-xs">
                  <div className="flex justify-between font-bold">
                    <span>{exp.company}</span>
                    <span className="text-gray-500 font-normal">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-xs font-semibold" style={{ color: accent }}>{exp.role}</div>
                  <p className="text-gray-700 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* Unified Template Renderer Switcher */
export const ResumeTemplateRenderer: React.FC<TemplateProps> = ({ data, templateDef }) => {
  const tId = data.templateId;
  const catalogTemplate = templateDef || getTemplateById(tId);
  const layout = catalogTemplate?.layoutType || 'modern';

  switch (layout) {
    case 'executive':
      return <ExecutiveTemplate data={data} templateDef={catalogTemplate} />;
    case 'creative':
      return <CreativeTemplate data={data} templateDef={catalogTemplate} />;
    case 'compact':
      return <CompactTemplate data={data} templateDef={catalogTemplate} />;
    case 'timeline':
      return <TimelineTemplate data={data} templateDef={catalogTemplate} />;
    case 'tech':
      return <TechMatrixTemplate data={data} templateDef={catalogTemplate} />;
    case 'academic':
      return <AcademicTemplate data={data} templateDef={catalogTemplate} />;
    case 'minimal':
      return <MinimalCenteredTemplate data={data} templateDef={catalogTemplate} />;
    case 'sidebar-right':
      return <SidebarRightTemplate data={data} templateDef={catalogTemplate} />;
    case 'gradient':
      return <GradientTemplate data={data} templateDef={catalogTemplate} />;
    case 'modern':
    default:
      return <ModernTemplate data={data} templateDef={catalogTemplate} />;
  }
};
