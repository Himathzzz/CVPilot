import type { TemplateConfig } from '../../types/templateEngine';

export const TEMPLATE_PACKS: TemplateConfig[] = [
  // FREE TEMPLATES (10)
  {
    id: 'modern-minimal',
    name: 'Modern Minimalist',
    category: 'Modern',
    industry: 'Technology',
    isPremium: false,
    isAtsFriendly: true,
    rating: 4.9,
    likesCount: 1420,
    downloadsCount: 8900,
    description: 'Clean single-column structural layout with subtle gold accents.',
    layout: {
      type: 'one-column',
      pageMargin: 'normal',
      sectionGap: 'normal',
      sidebarWidth: 0
    },
    typography: {
      fontFamily: 'sans',
      fontSizeScale: 1.0,
      headingWeight: 'extrabold',
      titleUppercase: true,
      letterSpacing: 'normal'
    },
    colorPalette: {
      primary: '#A38048',
      secondary: '#1A2536',
      accent: '#A38048',
      background: '#FFFFFF',
      text: '#1A2536',
      subtext: '#64748B',
      border: '#E2E8F0',
      cardBg: '#F8FAFC'
    },
    headerConfig: {
      style: 'modern-accent',
      showPhoto: true,
      photoStyle: 'circle',
      align: 'left',
      showSubtitleBadge: true
    },
    sectionOrder: ['summary', 'experience', 'skills', 'education', 'projects', 'certifications', 'languages'],
    sectionVisibility: {
      summary: true,
      experience: true,
      skills: true,
      education: true,
      projects: true,
      certifications: true,
      languages: true,
      awards: false
    },
    blockStyles: {
      borderStyle: 'thin',
      cardShadow: 'none',
      cardRadius: 'sm',
      badgeStyle: 'subtle',
      sectionHeadingStyle: 'left-bar'
    }
  },
  {
    id: 'compact-ats',
    name: 'Compact ATS Professional',
    category: 'ATS Friendly',
    industry: 'Corporate',
    isPremium: false,
    isAtsFriendly: true,
    rating: 4.8,
    likesCount: 1150,
    downloadsCount: 7200,
    description: 'High-density ATS-optimized format tailored for dense work history.',
    layout: {
      type: 'one-column',
      pageMargin: 'compact',
      sectionGap: 'compact',
      sidebarWidth: 0
    },
    typography: {
      fontFamily: 'sans',
      fontSizeScale: 0.95,
      headingWeight: 'bold',
      titleUppercase: true,
      letterSpacing: 'tight'
    },
    colorPalette: {
      primary: '#1A2536',
      secondary: '#334155',
      accent: '#1A2536',
      background: '#FFFFFF',
      text: '#0F172A',
      subtext: '#475569',
      border: '#CBD5E1',
      cardBg: '#FFFFFF'
    },
    headerConfig: {
      style: 'centered-classic',
      showPhoto: false,
      photoStyle: 'none',
      align: 'center',
      showSubtitleBadge: false
    },
    sectionOrder: ['summary', 'experience', 'skills', 'education', 'certifications'],
    sectionVisibility: {
      summary: true,
      experience: true,
      skills: true,
      education: true,
      projects: false,
      certifications: true,
      languages: false,
      awards: false
    },
    blockStyles: {
      borderStyle: 'thin',
      cardShadow: 'none',
      cardRadius: 'none',
      badgeStyle: 'outline',
      sectionHeadingStyle: 'underline'
    }
  },
  {
    id: 'executive-classic-free',
    name: 'Executive Classic',
    category: 'Executive',
    industry: 'Corporate',
    isPremium: false,
    isAtsFriendly: true,
    rating: 4.9,
    likesCount: 1680,
    downloadsCount: 9400,
    description: 'Classic navy banner layout for senior leaders and managers.',
    layout: {
      type: 'executive-banner',
      pageMargin: 'normal',
      sectionGap: 'spacious',
      sidebarWidth: 0
    },
    typography: {
      fontFamily: 'serif',
      fontSizeScale: 1.05,
      headingWeight: 'bold',
      titleUppercase: true,
      letterSpacing: 'wide'
    },
    colorPalette: {
      primary: '#1B2A4A',
      secondary: '#A38048',
      accent: '#A38048',
      background: '#FFFFFF',
      text: '#1E293B',
      subtext: '#64748B',
      border: '#E2E8F0',
      cardBg: '#F8FAFC'
    },
    headerConfig: {
      style: 'executive-banner',
      showPhoto: true,
      photoStyle: 'rounded',
      align: 'left',
      showSubtitleBadge: true
    },
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications'],
    sectionVisibility: {
      summary: true,
      experience: true,
      skills: true,
      education: true,
      projects: false,
      certifications: true,
      languages: false,
      awards: false
    },
    blockStyles: {
      borderStyle: 'accent-line',
      cardShadow: 'xs',
      cardRadius: 'md',
      badgeStyle: 'solid',
      sectionHeadingStyle: 'banner'
    }
  },
  {
    id: 'creative-sidebar-free',
    name: 'Creative Left Sidebar',
    category: 'Creative',
    industry: 'Design',
    isPremium: false,
    isAtsFriendly: false,
    rating: 4.7,
    likesCount: 980,
    downloadsCount: 5600,
    description: '2-column sidebar design with dark accent column and avatar.',
    layout: {
      type: 'two-column-left',
      pageMargin: 'compact',
      sectionGap: 'normal',
      sidebarWidth: 35
    },
    typography: {
      fontFamily: 'sans',
      fontSizeScale: 1.0,
      headingWeight: 'bold',
      titleUppercase: true,
      letterSpacing: 'normal'
    },
    colorPalette: {
      primary: '#0D9488',
      secondary: '#111827',
      accent: '#2DD4BF',
      background: '#FFFFFF',
      text: '#111827',
      subtext: '#4B5563',
      border: '#E5E7EB',
      cardBg: '#F9FAFB',
      sidebarBg: '#111827'
    },
    headerConfig: {
      style: 'creative-sidebar',
      showPhoto: true,
      photoStyle: 'rounded',
      align: 'center',
      showSubtitleBadge: true
    },
    sectionOrder: ['summary', 'experience', 'projects', 'skills', 'education'],
    sectionVisibility: {
      summary: true,
      experience: true,
      skills: true,
      education: true,
      projects: true,
      certifications: false,
      languages: true,
      awards: false
    },
    blockStyles: {
      borderStyle: 'thin',
      cardShadow: 'none',
      cardRadius: 'lg',
      badgeStyle: 'pill',
      sectionHeadingStyle: 'pill'
    }
  },
  {
    id: 'tech-matrix-free',
    name: 'Tech Stack Matrix',
    category: 'Developer',
    industry: 'Engineering',
    isPremium: false,
    isAtsFriendly: true,
    rating: 4.9,
    likesCount: 2100,
    downloadsCount: 11200,
    description: 'Monospace tech layout with terminal code block styling.',
    layout: {
      type: 'one-column',
      pageMargin: 'normal',
      sectionGap: 'normal',
      sidebarWidth: 0
    },
    typography: {
      fontFamily: 'mono',
      fontSizeScale: 0.95,
      headingWeight: 'bold',
      titleUppercase: false,
      letterSpacing: 'tight'
    },
    colorPalette: {
      primary: '#059669',
      secondary: '#0F172A',
      accent: '#10B981',
      background: '#FFFFFF',
      text: '#0F172A',
      subtext: '#475569',
      border: '#E2E8F0',
      cardBg: '#F8FAFC'
    },
    headerConfig: {
      style: 'tech-terminal',
      showPhoto: false,
      photoStyle: 'none',
      align: 'left',
      showSubtitleBadge: true
    },
    sectionOrder: ['skills', 'experience', 'projects', 'education'],
    sectionVisibility: {
      summary: false,
      experience: true,
      skills: true,
      education: true,
      projects: true,
      certifications: true,
      languages: false,
      awards: false
    },
    blockStyles: {
      borderStyle: 'thick',
      cardShadow: 'none',
      cardRadius: 'sm',
      badgeStyle: 'solid',
      sectionHeadingStyle: 'left-bar'
    }
  },
  {
    id: 'academic-scholar-free',
    name: 'Academic Scholar',
    category: 'Academic',
    industry: 'Education',
    isPremium: false,
    isAtsFriendly: true,
    rating: 4.6,
    likesCount: 840,
    downloadsCount: 4200,
    description: 'Formal serif publication-style layout for researchers and educators.',
    layout: {
      type: 'one-column',
      pageMargin: 'spacious',
      sectionGap: 'spacious',
      sidebarWidth: 0
    },
    typography: {
      fontFamily: 'serif',
      fontSizeScale: 1.05,
      headingWeight: 'semibold',
      titleUppercase: true,
      letterSpacing: 'wide'
    },
    colorPalette: {
      primary: '#1E3A8A',
      secondary: '#1E293B',
      accent: '#3B82F6',
      background: '#FFFFFF',
      text: '#1E293B',
      subtext: '#64748B',
      border: '#E2E8F0',
      cardBg: '#FFFFFF'
    },
    headerConfig: {
      style: 'centered-classic',
      showPhoto: false,
      photoStyle: 'none',
      align: 'center',
      showSubtitleBadge: false
    },
    sectionOrder: ['summary', 'education', 'experience', 'projects', 'certifications'],
    sectionVisibility: {
      summary: true,
      experience: true,
      skills: true,
      education: true,
      projects: true,
      certifications: true,
      languages: true,
      awards: false
    },
    blockStyles: {
      borderStyle: 'thin',
      cardShadow: 'none',
      cardRadius: 'none',
      badgeStyle: 'outline',
      sectionHeadingStyle: 'underline'
    }
  },
  {
    id: 'healthcare-vital-free',
    name: 'Healthcare Professional',
    category: 'Medical',
    industry: 'Healthcare',
    isPremium: false,
    isAtsFriendly: true,
    rating: 4.8,
    likesCount: 920,
    downloadsCount: 4900,
    description: 'Emerald accent layout tailored for clinical and nursing credentials.',
    layout: {
      type: 'one-column',
      pageMargin: 'normal',
      sectionGap: 'normal',
      sidebarWidth: 0
    },
    typography: {
      fontFamily: 'sans',
      fontSizeScale: 1.0,
      headingWeight: 'bold',
      titleUppercase: true,
      letterSpacing: 'normal'
    },
    colorPalette: {
      primary: '#0284C7',
      secondary: '#0F172A',
      accent: '#38BDF8',
      background: '#FFFFFF',
      text: '#0F172A',
      subtext: '#475569',
      border: '#E2E8F0',
      cardBg: '#F0F9FF'
    },
    headerConfig: {
      style: 'modern-accent',
      showPhoto: true,
      photoStyle: 'circle',
      align: 'left',
      showSubtitleBadge: true
    },
    sectionOrder: ['summary', 'certifications', 'experience', 'education', 'skills'],
    sectionVisibility: {
      summary: true,
      experience: true,
      skills: true,
      education: true,
      projects: false,
      certifications: true,
      languages: true,
      awards: false
    },
    blockStyles: {
      borderStyle: 'thin',
      cardShadow: 'xs',
      cardRadius: 'md',
      badgeStyle: 'subtle',
      sectionHeadingStyle: 'left-bar'
    }
  },
  {
    id: 'startup-agile-free',
    name: 'Startup Agile Lead',
    category: 'Startup',
    industry: 'Product Management',
    isPremium: false,
    isAtsFriendly: true,
    rating: 4.9,
    likesCount: 1350,
    downloadsCount: 7800,
    description: 'Dynamic gradient header with agile metrics and project cards.',
    layout: {
      type: 'one-column',
      pageMargin: 'compact',
      sectionGap: 'normal',
      sidebarWidth: 0
    },
    typography: {
      fontFamily: 'outfit',
      fontSizeScale: 1.0,
      headingWeight: 'extrabold',
      titleUppercase: true,
      letterSpacing: 'normal'
    },
    colorPalette: {
      primary: '#7C3AED',
      secondary: '#1E1B4B',
      accent: '#A78BFA',
      background: '#FFFFFF',
      text: '#1E1B4B',
      subtext: '#4C1D95',
      border: '#DDD6FE',
      cardBg: '#F5F3FF'
    },
    headerConfig: {
      style: 'gradient-hero',
      showPhoto: true,
      photoStyle: 'rounded',
      align: 'left',
      showSubtitleBadge: true
    },
    sectionOrder: ['summary', 'experience', 'projects', 'skills', 'education'],
    sectionVisibility: {
      summary: true,
      experience: true,
      skills: true,
      education: true,
      projects: true,
      certifications: true,
      languages: false,
      awards: false
    },
    blockStyles: {
      borderStyle: 'thin',
      cardShadow: 'sm',
      cardRadius: 'lg',
      badgeStyle: 'pill',
      sectionHeadingStyle: 'pill'
    }
  },
  {
    id: 'minimal-zen-free',
    name: 'Minimalist Zen',
    category: 'Minimal',
    industry: 'Design',
    isPremium: false,
    isAtsFriendly: true,
    rating: 4.8,
    likesCount: 1100,
    downloadsCount: 6500,
    description: 'Ultra-clean centered minimalist design with refined typography.',
    layout: {
      type: 'centered-minimal',
      pageMargin: 'spacious',
      sectionGap: 'spacious',
      sidebarWidth: 0
    },
    typography: {
      fontFamily: 'sans',
      fontSizeScale: 0.95,
      headingWeight: 'normal',
      titleUppercase: true,
      letterSpacing: 'widest'
    },
    colorPalette: {
      primary: '#475569',
      secondary: '#0F172A',
      accent: '#94A3B8',
      background: '#FFFFFF',
      text: '#1E293B',
      subtext: '#64748B',
      border: '#F1F5F9',
      cardBg: '#FFFFFF'
    },
    headerConfig: {
      style: 'centered-classic',
      showPhoto: false,
      photoStyle: 'none',
      align: 'center',
      showSubtitleBadge: false
    },
    sectionOrder: ['summary', 'experience', 'skills', 'education'],
    sectionVisibility: {
      summary: true,
      experience: true,
      skills: true,
      education: true,
      projects: false,
      certifications: false,
      languages: false,
      awards: false
    },
    blockStyles: {
      borderStyle: 'none',
      cardShadow: 'none',
      cardRadius: 'none',
      badgeStyle: 'subtle',
      sectionHeadingStyle: 'minimal'
    }
  },
  {
    id: 'timeline-career-free',
    name: 'Timeline Career Path',
    category: 'Modern',
    industry: 'General',
    isPremium: false,
    isAtsFriendly: false,
    rating: 4.7,
    likesCount: 1040,
    downloadsCount: 5900,
    description: 'Vertical milestone line connecting career history and achievements.',
    layout: {
      type: 'timeline',
      pageMargin: 'normal',
      sectionGap: 'normal',
      sidebarWidth: 0
    },
    typography: {
      fontFamily: 'sans',
      fontSizeScale: 1.0,
      headingWeight: 'bold',
      titleUppercase: true,
      letterSpacing: 'normal'
    },
    colorPalette: {
      primary: '#2563EB',
      secondary: '#1E3A8A',
      accent: '#60A5FA',
      background: '#FFFFFF',
      text: '#1E293B',
      subtext: '#64748B',
      border: '#DBEAFE',
      cardBg: '#EFF6FF'
    },
    headerConfig: {
      style: 'modern-accent',
      showPhoto: true,
      photoStyle: 'rounded',
      align: 'left',
      showSubtitleBadge: true
    },
    sectionOrder: ['summary', 'experience', 'skills', 'education', 'projects'],
    sectionVisibility: {
      summary: true,
      experience: true,
      skills: true,
      education: true,
      projects: true,
      certifications: false,
      languages: false,
      awards: false
    },
    blockStyles: {
      borderStyle: 'thin',
      cardShadow: 'xs',
      cardRadius: 'md',
      badgeStyle: 'pill',
      sectionHeadingStyle: 'left-bar'
    }
  },

  // PRO PREMIUM TEMPLATES (20)
  ...Array.from({ length: 20 }, (_, i) => {
    const num = i + 1;
    const isEven = num % 2 === 0;
    const categories = ['Executive', 'Developer', 'Creative', 'Corporate', 'Medical', 'Legal', 'Marketing', 'Finance', 'Luxury', 'Startup'];
    const cat = categories[i % categories.length];
    
    const colors = ['#A38048', '#1B2A4A', '#0D9488', '#BE123C', '#7C3AED', '#2563EB', '#059669', '#D97706'];
    const color = colors[i % colors.length];

    const layoutTypes: any[] = ['executive-banner', 'two-column-left', 'two-column-right', 'timeline', 'gradient-hero', 'one-column'];
    const lType = layoutTypes[i % layoutTypes.length];

    return {
      id: `pro-pack-template-${num}`,
      name: `${cat} ${lType.replace('-', ' ')} Pro ${num < 10 ? '0' + num : num}`,
      category: cat,
      industry: cat === 'Developer' ? 'Software Engineering' : cat === 'Medical' ? 'Healthcare' : 'Business',
      isPremium: true,
      isAtsFriendly: !lType.includes('two-column'),
      rating: +(4.7 + (i % 3) * 0.1).toFixed(1),
      likesCount: 1500 + i * 230,
      downloadsCount: 8000 + i * 1100,
      description: `Premium ${cat.toLowerCase()} template featuring ${lType} architectural layout and curated ${color} theme.`,
      layout: {
        type: lType,
        pageMargin: isEven ? 'compact' : 'normal',
        sectionGap: isEven ? 'normal' : 'spacious',
        sidebarWidth: 35
      },
      typography: {
        fontFamily: (i % 3 === 0 ? 'serif' : i % 3 === 1 ? 'mono' : 'sans') as any,
        fontSizeScale: 1.0,
        headingWeight: 'extrabold',
        titleUppercase: true,
        letterSpacing: 'wide'
      },
      colorPalette: {
        primary: color,
        secondary: '#1A2536',
        accent: color,
        background: '#FFFFFF',
        text: '#1E293B',
        subtext: '#64748B',
        border: '#E2E8F0',
        cardBg: '#F8FAFC',
        sidebarBg: '#1A2536'
      },
      headerConfig: {
        style: lType === 'executive-banner' ? 'executive-banner' : lType === 'gradient-hero' ? 'gradient-hero' : 'modern-accent',
        showPhoto: true,
        photoStyle: 'rounded',
        align: 'left',
        showSubtitleBadge: true
      },
      sectionOrder: ['summary', 'experience', 'skills', 'education', 'projects', 'certifications'],
      sectionVisibility: {
        summary: true,
        experience: true,
        skills: true,
        education: true,
        projects: true,
        certifications: true,
        languages: true,
        awards: false
      },
      blockStyles: {
        borderStyle: 'thin',
        cardShadow: 'sm',
        cardRadius: 'md',
        badgeStyle: 'solid',
        sectionHeadingStyle: 'left-bar'
      }
    } as TemplateConfig;
  })
];

export const getTemplateConfigById = (id: string): TemplateConfig => {
  if (!id) return TEMPLATE_PACKS[0];
  const normalizedId = id.toLowerCase();
  if (normalizedId === 'modern') return TEMPLATE_PACKS.find(t => t.id === 'modern-minimal') || TEMPLATE_PACKS[0];
  if (normalizedId === 'compact') return TEMPLATE_PACKS.find(t => t.id === 'compact-ats') || TEMPLATE_PACKS[0];
  if (normalizedId === 'executive') return TEMPLATE_PACKS.find(t => t.id === 'executive-classic-free') || TEMPLATE_PACKS[0];
  if (normalizedId === 'creative') return TEMPLATE_PACKS.find(t => t.id === 'creative-sidebar-free') || TEMPLATE_PACKS[0];
  return TEMPLATE_PACKS.find(t => t.id === id) || TEMPLATE_PACKS[0];
};
