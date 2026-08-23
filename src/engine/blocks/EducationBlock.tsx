import React from 'react';
import type { ResumeData } from '../../types/resume';
import type { TemplateConfig } from '../../types/templateEngine';

interface BlockProps {
  data: ResumeData;
  config: TemplateConfig;
}

export const EducationBlock: React.FC<BlockProps> = ({ data, config }) => {
  const { education } = data;
  const { colorPalette } = config;

  if (!education || education.length === 0) return null;

  return (
    <div className="space-y-2">
      <h2 
        className="text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 pb-1 border-b"
        style={{ color: colorPalette.primary, borderColor: colorPalette.border }}
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorPalette.primary }}></span>
        Education & Qualifications
      </h2>

      <div className="space-y-2">
        {education.map((edu) => (
          <div key={edu.id} className="flex justify-between items-start text-xs">
            <div>
              <div className="font-bold" style={{ color: colorPalette.text }}>
                {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
              </div>
              <div style={{ color: colorPalette.subtext }}>
                {edu.institution} {edu.location ? `(${edu.location})` : ''}
              </div>
            </div>
            <div className="text-right font-medium" style={{ color: colorPalette.subtext }}>
              {edu.startDate} – {edu.endDate}
              {edu.gpa && <div className="text-[11px]" style={{ color: colorPalette.primary }}>GPA: {edu.gpa}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
