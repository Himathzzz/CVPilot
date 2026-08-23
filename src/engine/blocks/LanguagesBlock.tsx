import React from 'react';
import type { ResumeData } from '../../types/resume';
import type { TemplateConfig } from '../../types/templateEngine';

interface BlockProps {
  data: ResumeData;
  config: TemplateConfig;
}

export const LanguagesBlock: React.FC<BlockProps> = ({ data, config }) => {
  const languages = (data as any).languages || [];
  const { colorPalette } = config;

  if (!languages || languages.length === 0) return null;

  return (
    <div className="space-y-2">
      <h2 
        className="text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 pb-1 border-b"
        style={{ color: colorPalette.primary, borderColor: colorPalette.border }}
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorPalette.primary }}></span>
        Languages
      </h2>

      <div className="flex flex-wrap gap-2 text-xs">
        {languages.map((lang: any, idx: number) => (
          <span 
            key={idx} 
            className="px-2.5 py-1 rounded font-medium border"
            style={{ 
              color: colorPalette.text, 
              borderColor: colorPalette.border, 
              backgroundColor: colorPalette.cardBg 
            }}
          >
            <strong>{lang.name || lang}</strong> {lang.proficiency ? <span className="text-gray-500 font-normal">({lang.proficiency})</span> : null}
          </span>
        ))}
      </div>
    </div>
  );
};
