import React from 'react';
import type { ResumeData } from '../../types/resume';
import type { TemplateConfig } from '../../types/templateEngine';

interface BlockProps {
  data: ResumeData;
  config: TemplateConfig;
}

export const SkillsBlock: React.FC<BlockProps> = ({ data, config }) => {
  const { skillCategories } = data;
  const { colorPalette } = config;

  if (!skillCategories || skillCategories.length === 0) return null;

  return (
    <div className="space-y-2">
      <h2 
        className="text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 pb-1 border-b"
        style={{ color: colorPalette.primary, borderColor: colorPalette.border }}
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorPalette.primary }}></span>
        Core Competencies & Skills
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {skillCategories.map((cat) => (
          <div key={cat.id} className="space-y-1">
            <span className="text-xs font-bold uppercase block" style={{ color: colorPalette.text }}>
              {cat.categoryName}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="text-[11px] px-2 py-0.5 rounded font-medium border shadow-2xs"
                  style={{ 
                    color: colorPalette.text, 
                    borderColor: colorPalette.border, 
                    backgroundColor: `${colorPalette.primary}12` 
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
