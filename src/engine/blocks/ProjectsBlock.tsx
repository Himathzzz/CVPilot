import React from 'react';
import type { ResumeData } from '../../types/resume';
import type { TemplateConfig } from '../../types/templateEngine';

interface BlockProps {
  data: ResumeData;
  config: TemplateConfig;
}

export const ProjectsBlock: React.FC<BlockProps> = ({ data, config }) => {
  const { projects } = data;
  const { colorPalette } = config;

  if (!projects || projects.length === 0) return null;

  return (
    <div className="space-y-2">
      <h2 
        className="text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 pb-1 border-b"
        style={{ color: colorPalette.primary, borderColor: colorPalette.border }}
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorPalette.primary }}></span>
        Key Projects & Accomplishments
      </h2>

      <div className="grid grid-cols-1 gap-2.5">
        {projects.map((proj) => {
          const title = proj.title || (proj as any).name || 'Project';
          const techList = Array.isArray(proj.technologies) ? proj.technologies : typeof proj.technologies === 'string' ? [proj.technologies] : [];

          return (
            <div key={proj.id} className="p-2.5 rounded border text-xs" style={{ borderColor: colorPalette.border, backgroundColor: colorPalette.cardBg }}>
              <div className="flex justify-between font-bold" style={{ color: colorPalette.text }}>
                <span>{title}</span>
                {proj.link && <span className="text-[11px] font-mono underline" style={{ color: colorPalette.primary }}>{proj.link}</span>}
              </div>
              {proj.description && <p className="mt-1" style={{ color: colorPalette.subtext }}>{proj.description}</p>}
              {techList.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {techList.map((tech: string, i: number) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-gray-100 text-gray-700">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
