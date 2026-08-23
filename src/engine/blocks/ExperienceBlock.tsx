import React from 'react';
import type { ResumeData } from '../../types/resume';
import type { TemplateConfig } from '../../types/templateEngine';

interface BlockProps {
  data: ResumeData;
  config: TemplateConfig;
}

export const ExperienceBlock: React.FC<BlockProps> = ({ data, config }) => {
  const { experiences } = data;
  const { colorPalette, layout } = config;

  if (!experiences || experiences.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 
        className="text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 pb-1 border-b"
        style={{ color: colorPalette.primary, borderColor: colorPalette.border }}
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorPalette.primary }}></span>
        Professional Experience
      </h2>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div 
            key={exp.id} 
            className={layout.type === 'timeline' ? 'relative pl-4 border-l-2' : ''}
            style={layout.type === 'timeline' ? { borderColor: colorPalette.primary } : {}}
          >
            {layout.type === 'timeline' && (
              <div 
                className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" 
                style={{ backgroundColor: colorPalette.primary }}
              />
            )}
            
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-sm" style={{ color: colorPalette.text }}>{exp.company}</span>
              <span className="text-xs font-medium" style={{ color: colorPalette.subtext }}>
                {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
              </span>
            </div>
            
            <div className="text-xs font-semibold mb-1" style={{ color: colorPalette.primary }}>
              {exp.role} {exp.location ? `• ${exp.location}` : ''}
            </div>

            {exp.description && (
              <p className="text-xs leading-relaxed" style={{ color: colorPalette.text }}>
                {exp.description}
              </p>
            )}

            {exp.bulletPoints && exp.bulletPoints.length > 0 && (
              <ul className="list-disc list-inside space-y-0.5 text-xs mt-1 pl-1" style={{ color: colorPalette.text }}>
                {exp.bulletPoints.map((bp, i) => (
                  <li key={i}>{bp}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
