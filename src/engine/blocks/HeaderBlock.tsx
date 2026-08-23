import React from 'react';
import type { ResumeData } from '../../types/resume';
import type { TemplateConfig } from '../../types/templateEngine';

interface BlockProps {
  data: ResumeData;
  config: TemplateConfig;
}

export const HeaderBlock: React.FC<BlockProps> = ({ data, config }) => {
  const { personalInfo } = data;
  const { headerConfig, colorPalette, typography } = config;

  const fontClass = 
    typography.fontFamily === 'serif' || typography.fontFamily === 'playfair' || typography.fontFamily === 'merriweather' ? 'font-serif' :
    typography.fontFamily === 'mono' || typography.fontFamily === 'fira-code' ? 'font-mono' :
    typography.fontFamily === 'outfit' ? 'font-display' : 'font-sans';

  const photoRadiusClass = 
    headerConfig.photoStyle === 'circle' ? 'rounded-full' :
    headerConfig.photoStyle === 'rounded' ? 'rounded-xl' : 'rounded-none';

  // Styles based on headerConfig.style
  if (headerConfig.style === 'executive-banner' || headerConfig.style === 'gradient-hero') {
    return (
      <div 
        className={`p-8 text-white flex flex-col md:flex-row justify-between items-center gap-4 ${fontClass}`}
        style={{ 
          background: headerConfig.style === 'gradient-hero'
            ? `linear-gradient(135deg, ${colorPalette.primary} 0%, ${colorPalette.accent} 100%)`
            : colorPalette.primary
        }}
      >
        <div className="flex items-center gap-5">
          {personalInfo.showPhoto && personalInfo.photoUrl && headerConfig.showPhoto && (
            <img 
              src={personalInfo.photoUrl} 
              alt={personalInfo.fullName} 
              className={`w-24 h-24 shadow-md border-2 border-white object-cover shrink-0 ${photoRadiusClass}`} 
            />
          )}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase leading-none text-white">
              {personalInfo.fullName || 'YOUR NAME'}
            </h1>
            <div className="font-semibold tracking-widest uppercase text-sm mt-2" style={{ color: colorPalette.accent }}>
              {personalInfo.jobTitle || 'TARGET JOB TITLE'}
            </div>
          </div>
        </div>

        <div className="text-xs space-y-1 text-left md:text-right border-t md:border-t-0 md:border-l border-white/20 pt-3 md:pt-0 md:pl-4 opacity-90 font-sans">
          {personalInfo.email && <div>✉ {personalInfo.email}</div>}
          {personalInfo.phone && <div>📞 {personalInfo.phone}</div>}
          {personalInfo.location && <div>📍 {personalInfo.location}</div>}
          {personalInfo.linkedin && <div>🔗 {personalInfo.linkedin}</div>}
        </div>
      </div>
    );
  }

  if (headerConfig.style === 'centered-classic') {
    return (
      <div className={`text-center space-y-2 pb-5 border-b ${fontClass}`} style={{ borderColor: colorPalette.border }}>
        {personalInfo.showPhoto && personalInfo.photoUrl && headerConfig.showPhoto && (
          <img 
            src={personalInfo.photoUrl} 
            alt={personalInfo.fullName} 
            className={`w-20 h-20 shadow-md border-2 border-gray-300 mx-auto object-cover ${photoRadiusClass}`} 
          />
        )}
        <h1 className="text-3xl font-bold uppercase tracking-widest" style={{ color: colorPalette.text }}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: colorPalette.primary }}>
          {personalInfo.jobTitle}
        </div>
        <div className="text-[11px] flex justify-center flex-wrap gap-2 pt-1 font-sans" style={{ color: colorPalette.subtext }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.location && <span>| {personalInfo.location}</span>}
          {personalInfo.website && <span>| {personalInfo.website}</span>}
        </div>
      </div>
    );
  }

  if (headerConfig.style === 'tech-terminal') {
    return (
      <div className="bg-gray-900 text-gray-100 p-5 rounded-lg border border-gray-800 flex justify-between items-center font-mono">
        <div>
          <div className="text-[10px] text-gray-500 font-bold mb-1">// USER PROFILE</div>
          <h1 className="text-2xl font-black text-white">{personalInfo.fullName || 'YOUR NAME'}</h1>
          <div className="text-xs font-bold mt-1" style={{ color: colorPalette.accent }}>
            &gt; {personalInfo.jobTitle}
          </div>
        </div>
        <div className="text-right text-[11px] text-gray-400 space-y-0.5">
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
        </div>
      </div>
    );
  }

  // Default Modern Accent Header
  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b ${fontClass}`} style={{ borderColor: colorPalette.border }}>
      <div className="flex items-center gap-4">
        {personalInfo.showPhoto && personalInfo.photoUrl && headerConfig.showPhoto && (
          <img 
            src={personalInfo.photoUrl} 
            alt={personalInfo.fullName} 
            className={`w-20 h-20 object-cover border-2 shadow-xs shrink-0 ${photoRadiusClass}`}
            style={{ borderColor: colorPalette.primary }}
          />
        )}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight uppercase leading-none" style={{ color: colorPalette.text }}>
            {personalInfo.fullName || 'YOUR NAME'}
          </h1>
          <div className="text-sm font-bold tracking-wider mt-1.5 uppercase" style={{ color: colorPalette.primary }}>
            {personalInfo.jobTitle || 'TARGET JOB TITLE'}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs mt-2 font-medium" style={{ color: colorPalette.subtext }}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
            {personalInfo.website && <span>• {personalInfo.website}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
