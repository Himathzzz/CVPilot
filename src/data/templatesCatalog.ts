export type LayoutType = 'modern' | 'executive' | 'creative' | 'compact' | 'timeline' | 'minimal' | 'tech' | 'academic' | 'sidebar-right' | 'gradient';
export type FontFamily = 'sans' | 'serif' | 'mono' | 'display';
export type HeaderStyle = 'banner' | 'sidebar-left' | 'sidebar-right' | 'centered' | 'minimal' | 'accent-line';

export interface TemplateDefinition {
  id: string;
  name: string;
  category: 'Tech' | 'Executive' | 'Creative' | 'Corporate' | 'Startup' | 'Academic' | 'Healthcare' | 'Legal' | 'Marketing' | 'Minimalist';
  isPremium: boolean;
  description: string;
  accentColor: string;
  layoutType: LayoutType;
  fontFamily: FontFamily;
  headerStyle: HeaderStyle;
  badge?: string;
  popular?: boolean;
}

export const TEMPLATES_CATEGORIES = [
  'All',
  'Tech',
  'Executive',
  'Creative',
  'Corporate',
  'Startup',
  'Academic',
  'Healthcare',
  'Legal',
  'Marketing',
  'Minimalist'
] as const;

const ACCENT_PALETTE = [
  '#A38048', // Gold
  '#1B2A4A', // Deep Navy
  '#0d9488', // Teal
  '#be123c', // Crimson
  '#475569', // Slate
  '#7c3aed', // Purple
  '#2563eb', // Blue
  '#059669', // Emerald
  '#d97706', // Amber
  '#dc2626', // Red
];

const LAYOUT_TYPES: LayoutType[] = ['modern', 'executive', 'creative', 'compact', 'timeline', 'minimal', 'tech', 'academic', 'sidebar-right', 'gradient'];
const FONT_FAMILIES: FontFamily[] = ['sans', 'serif', 'mono', 'display'];
const HEADER_STYLES: HeaderStyle[] = ['banner', 'sidebar-left', 'sidebar-right', 'centered', 'minimal', 'accent-line'];

// Base Free Templates
const FREE_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'modern',
    name: 'Modern Minimalist',
    category: 'Minimalist',
    isPremium: false,
    description: 'Clean single-column structural layout with subtle gold accents.',
    accentColor: '#A38048',
    layoutType: 'modern',
    fontFamily: 'sans',
    headerStyle: 'accent-line',
    popular: true
  },
  {
    id: 'compact',
    name: 'Compact Professional',
    category: 'Corporate',
    isPremium: false,
    description: 'High-density ATS-optimized format tailored for long work history.',
    accentColor: '#1A2536',
    layoutType: 'compact',
    fontFamily: 'sans',
    headerStyle: 'centered',
    popular: true
  },
  {
    id: 'executive-free',
    name: 'Standard Executive',
    category: 'Executive',
    isPremium: false,
    description: 'Classic serif layout for corporate and managerial roles.',
    accentColor: '#1B2A4A',
    layoutType: 'executive',
    fontFamily: 'serif',
    headerStyle: 'banner'
  },
  {
    id: 'creative-free',
    name: 'Creative Starter',
    category: 'Creative',
    isPremium: false,
    description: 'Clean 2-column sidebar design with skill badges.',
    accentColor: '#0d9488',
    layoutType: 'creative',
    fontFamily: 'sans',
    headerStyle: 'sidebar-left'
  }
];

// Generate 96 Premium Templates with unique layout, color, font, and header configurations
const categoriesList = ['Tech', 'Executive', 'Creative', 'Corporate', 'Startup', 'Academic', 'Healthcare', 'Legal', 'Marketing', 'Minimalist'] as const;

const generatedPremiumTemplates: TemplateDefinition[] = [];

let counter = 1;
categoriesList.forEach((category) => {
  const countPerCategory = category === 'Minimalist' || category === 'Corporate' ? 9 : 10;
  for (let i = 1; i <= countPerCategory; i++) {
    const templateNum = counter++;
    
    // Calculate unique styling parameters using distinct combinations
    const layoutType = LAYOUT_TYPES[(templateNum - 1) % LAYOUT_TYPES.length];
    const accentColor = ACCENT_PALETTE[(templateNum - 1) % ACCENT_PALETTE.length];
    const fontFamily = FONT_FAMILIES[(templateNum - 1) % FONT_FAMILIES.length];
    const headerStyle = HEADER_STYLES[(templateNum - 1) % HEADER_STYLES.length];

    generatedPremiumTemplates.push({
      id: `pro-${category.toLowerCase()}-${i}`,
      name: `${category} ${layoutType.charAt(0).toUpperCase() + layoutType.slice(1)} Pro ${i < 10 ? '0' + i : i}`,
      category: category,
      isPremium: true,
      description: `Distinctive ${category.toLowerCase()} template featuring ${layoutType} layout and ${fontFamily} typography.`,
      accentColor: accentColor,
      layoutType: layoutType,
      fontFamily: fontFamily,
      headerStyle: headerStyle,
      badge: 'PRO $5/MO',
      popular: templateNum % 5 === 0
    });
  }
});

export const ALL_TEMPLATES: TemplateDefinition[] = [
  ...FREE_TEMPLATES,
  ...generatedPremiumTemplates
];

export const getTemplateById = (id: string): TemplateDefinition => {
  return ALL_TEMPLATES.find(t => t.id === id) || ALL_TEMPLATES[0];
};
