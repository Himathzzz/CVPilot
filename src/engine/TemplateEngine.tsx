import React from 'react';
import type { ResumeData } from '../types/resume';
import type { TemplateConfig, SectionKey } from '../types/templateEngine';
import { HeaderBlock } from './blocks/HeaderBlock';
import { SummaryBlock } from './blocks/SummaryBlock';
import { ExperienceBlock } from './blocks/ExperienceBlock';
import { SkillsBlock } from './blocks/SkillsBlock';
import { EducationBlock } from './blocks/EducationBlock';
import { ProjectsBlock } from './blocks/ProjectsBlock';
import { CertificationsBlock } from './blocks/CertificationsBlock';
import { LanguagesBlock } from './blocks/LanguagesBlock';

interface TemplateEngineProps {
  data: ResumeData;
  config: TemplateConfig;
  zoomScale?: number;
}

export const TemplateEngine: React.FC<TemplateEngineProps> = ({ data, config, zoomScale = 1 }) => {
  const { layout, typography, colorPalette, sectionOrder, sectionVisibility } = config;

  const fontClass = 
    typography.fontFamily === 'serif' || typography.fontFamily === 'playfair' || typography.fontFamily === 'merriweather' ? 'font-serif' :
    typography.fontFamily === 'mono' || typography.fontFamily === 'fira-code' ? 'font-mono' :
    typography.fontFamily === 'outfit' ? 'font-display' : 'font-sans';

  const marginClass = 
    layout.pageMargin === 'compact' ? 'p-5 md:p-6' :
    layout.pageMargin === 'spacious' ? 'p-9 md:p-11' : 'p-7 md:p-9';

  const gapClass = 
    layout.sectionGap === 'compact' ? 'space-y-3.5' :
    layout.sectionGap === 'spacious' ? 'space-y-7' : 'space-y-5';

  const renderSectionBlock = (sectionKey: SectionKey) => {
    if (sectionVisibility && sectionVisibility[sectionKey] === false) return null;

    switch (sectionKey) {
      case 'summary':
        return <SummaryBlock key="summary" data={data} config={config} />;
      case 'experience':
        return <ExperienceBlock key="experience" data={data} config={config} />;
      case 'skills':
        return <SkillsBlock key="skills" data={data} config={config} />;
      case 'education':
        return <EducationBlock key="education" data={data} config={config} />;
      case 'projects':
        return <ProjectsBlock key="projects" data={data} config={config} />;
      case 'certifications':
        return <CertificationsBlock key="certifications" data={data} config={config} />;
      case 'languages':
        return <LanguagesBlock key="languages" data={data} config={config} />;
      default:
        return null;
    }
  };

  // Two-column layout rendering
  if (layout.type === 'two-column-left' || layout.type === 'two-column-right') {
    const isSidebarLeft = layout.type === 'two-column-left';
    
    // Sidebar sections vs Main column sections based on config.sectionOrder
    const sidebarKeysSet = new Set<SectionKey>(['skills', 'education', 'certifications', 'languages']);
    const sidebarSections = sectionOrder.filter(k => sidebarKeysSet.has(k));
    const mainSections = sectionOrder.filter(k => !sidebarKeysSet.has(k));

    const sidebarContent = (
      <div 
        className="p-6 md:p-8 space-y-6 text-white flex flex-col justify-start min-h-full"
        style={{ backgroundColor: colorPalette.sidebarBg || colorPalette.primary }}
      >
        {personalInfoSidebar(data, config)}
        {sidebarSections.map((secKey) => renderSectionBlock(secKey))}
      </div>
    );

    const mainContent = (
      <div className="p-6 md:p-8 space-y-5 bg-white">
        {!isSidebarLeft && <HeaderBlock data={data} config={config} />}
        {mainSections.map((secKey) => renderSectionBlock(secKey))}
      </div>
    );

    return (
      <div 
        className={`w-full bg-white min-h-full border shadow-sm transition-all duration-200 ${fontClass}`}
        style={{ 
          transform: `scale(${zoomScale})`, 
          transformOrigin: 'top center',
          color: colorPalette.text 
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-full">
          {isSidebarLeft ? (
            <>
              <div className="md:col-span-4">{sidebarContent}</div>
              <div className="md:col-span-8">{mainContent}</div>
            </>
          ) : (
            <>
              <div className="md:col-span-8">{mainContent}</div>
              <div className="md:col-span-4">{sidebarContent}</div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Single Column Standard / Executive / Timeline / Tech / Centered Layouts
  return (
    <div 
      className={`w-full min-h-full border shadow-sm transition-all duration-200 ${fontClass}`}
      style={{ 
        transform: `scale(${zoomScale})`, 
        transformOrigin: 'top center',
        backgroundColor: colorPalette.background,
        color: colorPalette.text 
      }}
    >
      <HeaderBlock data={data} config={config} />

      <div className={`${marginClass} ${gapClass}`}>
        {sectionOrder.map((sectionKey) => renderSectionBlock(sectionKey))}
      </div>
    </div>
  );
};

// Sidebar Personal info summary helper
const personalInfoSidebar = (data: ResumeData, config: TemplateConfig) => {
  const { personalInfo } = data;
  const { colorPalette, headerConfig } = config;

  return (
    <div className="space-y-4 border-b border-white/20 pb-5">
      {personalInfo.showPhoto && personalInfo.photoUrl && headerConfig.showPhoto && (
        <img 
          src={personalInfo.photoUrl} 
          alt={personalInfo.fullName} 
          className="w-24 h-24 rounded-xl object-cover border-2 mx-auto shadow-md"
          style={{ borderColor: colorPalette.accent }}
        />
      )}
      <div className="text-center">
        <h1 className="text-xl font-bold uppercase tracking-tight text-white">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: colorPalette.accent }}>
          {personalInfo.jobTitle}
        </p>
      </div>
      <div className="border-t border-white/20 pt-3 space-y-1.5 text-xs text-white/90 font-sans">
        {personalInfo.email && <div className="truncate">✉ {personalInfo.email}</div>}
        {personalInfo.phone && <div>📞 {personalInfo.phone}</div>}
        {personalInfo.location && <div>📍 {personalInfo.location}</div>}
      </div>
    </div>
  );
};
