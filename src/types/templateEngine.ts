export type LayoutType = 
  | 'one-column' 
  | 'two-column-left' 
  | 'two-column-right' 
  | 'executive-banner' 
  | 'timeline' 
  | 'tech-grid' 
  | 'centered-minimal' 
  | 'gradient-hero';

export type FontFamilyType = 'sans' | 'serif' | 'mono' | 'outfit' | 'inter' | 'playfair' | 'fira-code' | 'roboto' | 'merriweather';

export type HeaderStyleType = 'modern-accent' | 'executive-banner' | 'creative-sidebar' | 'centered-classic' | 'gradient-hero' | 'tech-terminal';

export type PhotoStyleType = 'circle' | 'square' | 'rounded' | 'none';

export type SectionKey = 
  | 'summary' 
  | 'experience' 
  | 'skills' 
  | 'education' 
  | 'projects' 
  | 'certifications' 
  | 'languages' 
  | 'awards';

export interface ColorPaletteConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  subtext: string;
  border: string;
  cardBg: string;
  sidebarBg?: string;
  headerBg?: string;
}

export interface TypographyConfig {
  fontFamily: FontFamilyType;
  fontSizeScale: number;
  headingWeight: 'normal' | 'semibold' | 'bold' | 'extrabold';
  titleUppercase: boolean;
  letterSpacing: 'tight' | 'normal' | 'wide' | 'widest';
}

export interface LayoutConfig {
  type: LayoutType;
  pageMargin: 'compact' | 'normal' | 'spacious';
  sectionGap: 'compact' | 'normal' | 'spacious';
  sidebarWidth: number;
}

export interface HeaderConfig {
  style: HeaderStyleType;
  showPhoto: boolean;
  photoStyle: PhotoStyleType;
  align: 'left' | 'center' | 'right';
  showSubtitleBadge: boolean;
}

export interface BlockStyleConfig {
  borderStyle: 'none' | 'thin' | 'thick' | 'dashed' | 'accent-line';
  cardShadow: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  cardRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  badgeStyle: 'solid' | 'outline' | 'pill' | 'subtle';
  sectionHeadingStyle: 'underline' | 'pill' | 'left-bar' | 'minimal' | 'banner';
}

export interface TemplateConfig {
  id: string;
  name: string;
  category: string;
  industry: string;
  isPremium: boolean;
  isAtsFriendly: boolean;
  rating: number;
  likesCount: number;
  downloadsCount: number;
  description: string;
  
  layout: LayoutConfig;
  typography: TypographyConfig;
  colorPalette: ColorPaletteConfig;
  headerConfig: HeaderConfig;
  sectionOrder: SectionKey[];
  sectionVisibility: Record<SectionKey, boolean>;
  blockStyles: BlockStyleConfig;
}
