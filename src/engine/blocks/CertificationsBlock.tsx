import React from 'react';
import type { ResumeData } from '../../types/resume';
import type { TemplateConfig } from '../../types/templateEngine';

interface BlockProps {
  data: ResumeData;
  config: TemplateConfig;
}

export const CertificationsBlock: React.FC<BlockProps> = ({ data, config }) => {
  const { certifications } = data;
  const { colorPalette } = config;

  if (!certifications || certifications.length === 0) return null;

  return (
    <div className="space-y-2">
      <h2 
        className="text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 pb-1 border-b"
        style={{ color: colorPalette.primary, borderColor: colorPalette.border }}
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorPalette.primary }}></span>
        Certifications & Licensures
      </h2>

      <div className="space-y-1 text-xs">
        {certifications.map((cert) => (
          <div key={cert.id} className="flex justify-between items-baseline">
            <span className="font-bold" style={{ color: colorPalette.text }}>
              {cert.name} <span className="font-normal text-gray-500">• {cert.issuer}</span>
            </span>
            <span className="text-[11px] font-medium" style={{ color: colorPalette.subtext }}>
              {cert.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
