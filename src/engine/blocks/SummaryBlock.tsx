import React from 'react';
import type { ResumeData } from '../../types/resume';
import type { TemplateConfig } from '../../types/templateEngine';

interface BlockProps {
  data: ResumeData;
  config: TemplateConfig;
}

export const SummaryBlock: React.FC<BlockProps> = ({ data, config }) => {
  const { personalInfo } = data;
  const { colorPalette } = config;

  if (!personalInfo.summary) return null;

  return (
    <div className="space-y-1.5">
      <h2 
        className="text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 pb-1 border-b"
        style={{ color: colorPalette.primary, borderColor: colorPalette.border }}
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorPalette.primary }}></span>
        Professional Summary
      </h2>
      <p 
        className="text-xs md:text-sm leading-relaxed" 
        style={{ color: colorPalette.text }}
      >
        {personalInfo.summary}
      </p>
    </div>
  );
};
