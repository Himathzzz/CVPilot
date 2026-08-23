import React from 'react';
import type { TemplateConfig, FontFamilyType, LayoutType, HeaderStyleType } from '../types/templateEngine';

interface TemplateCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  config: TemplateConfig;
  onChangeConfig: (newConfig: TemplateConfig) => void;
}

const COLOR_PRESETS = [
  { name: 'Gold Luxe', primary: '#A38048', accent: '#D4AF37' },
  { name: 'Navy Corporate', primary: '#1B2A4A', accent: '#2563EB' },
  { name: 'Teal Modern', primary: '#0D9488', accent: '#2DD4BF' },
  { name: 'Crimson Executive', primary: '#BE123C', accent: '#FB7185' },
  { name: 'Emerald Tech', primary: '#059669', accent: '#34D399' },
  { name: 'Violet Creative', primary: '#7C3AED', accent: '#A78BFA' },
  { name: 'Slate Minimal', primary: '#475569', accent: '#94A3B8' },
  { name: 'Amber Warm', primary: '#D97706', accent: '#FBBF24' }
];

export const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig
}) => {
  if (!isOpen) return null;

  const updateColor = (key: string, value: string) => {
    onChangeConfig({
      ...config,
      colorPalette: {
        ...config.colorPalette,
        [key]: value
      }
    });
  };

  const updateFontFamily = (family: FontFamilyType) => {
    onChangeConfig({
      ...config,
      typography: {
        ...config.typography,
        fontFamily: family
      }
    });
  };

  const updateLayoutType = (lType: LayoutType) => {
    onChangeConfig({
      ...config,
      layout: {
        ...config.layout,
        type: lType
      }
    });
  };

  const updateHeaderStyle = (hStyle: HeaderStyleType) => {
    onChangeConfig({
      ...config,
      headerConfig: {
        ...config.headerConfig,
        style: hStyle
      }
    });
  };

  const updatePageMargin = (margin: 'compact' | 'normal' | 'spacious') => {
    onChangeConfig({
      ...config,
      layout: {
        ...config.layout,
        pageMargin: margin
      }
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 shadow-2xl border-l border-outline-variant dark:border-slate-800 flex flex-col animate-slide-left transition-colors duration-300">
      {/* Header */}
      <div className="p-4 bg-navy dark:bg-slate-950 text-white flex justify-between items-center border-b border-gold/30">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-gold">tune</span>
          <h3 className="font-bold text-sm uppercase tracking-wide text-white">Template Customizer</h3>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Customizer Options Body */}
      <div className="p-5 flex-grow overflow-y-auto space-y-6 text-xs text-navy dark:text-slate-200">
        
        {/* Color Palette Controls */}
        <div className="space-y-3">
          <h4 className="font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-slate-800 pb-1 text-gold">Theme Colors</h4>
          
          <div className="grid grid-cols-4 gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  onChangeConfig({
                    ...config,
                    colorPalette: {
                      ...config.colorPalette,
                      primary: preset.primary,
                      accent: preset.accent,
                      sidebarBg: config.colorPalette.sidebarBg ? preset.primary : undefined
                    }
                  });
                }}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-gold text-center space-y-1 bg-gray-50 dark:bg-slate-800"
              >
                <div className="w-full h-5 rounded flex overflow-hidden">
                  <div className="w-1/2 h-full" style={{ backgroundColor: preset.primary }}></div>
                  <div className="w-1/2 h-full" style={{ backgroundColor: preset.accent }}></div>
                </div>
                <div className="text-[9px] font-semibold truncate dark:text-slate-300">{preset.name.split(' ')[0]}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-semibold mb-1 text-navy dark:text-slate-300">Primary Color</label>
              <input 
                type="color" 
                value={config.colorPalette.primary} 
                onChange={(e) => updateColor('primary', e.target.value)}
                className="w-full h-8 rounded border dark:border-slate-700 cursor-pointer bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold mb-1 text-navy dark:text-slate-300">Accent Color</label>
              <input 
                type="color" 
                value={config.colorPalette.accent} 
                onChange={(e) => updateColor('accent', e.target.value)}
                className="w-full h-8 rounded border dark:border-slate-700 cursor-pointer bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Typography Controls */}
        <div className="space-y-3">
          <h4 className="font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-slate-800 pb-1 text-gold">Typography & Fonts</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'sans', name: 'SF Pro (San Francisco)' },
              { id: 'serif', name: 'Serif Classic' },
              { id: 'mono', name: 'Mono Code' },
              { id: 'outfit', name: 'Outfit Display' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => updateFontFamily(f.id as FontFamilyType)}
                className={`p-2 rounded-lg border text-center font-medium transition-all ${
                  config.typography.fontFamily === f.id ? 'border-gold bg-gold/10 font-bold text-navy dark:text-gold' : 'border-gray-200 dark:border-slate-700 text-navy dark:text-slate-300'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Layout & Architecture */}
        <div className="space-y-3">
          <h4 className="font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-slate-800 pb-1 text-gold">Layout Architecture</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'one-column', label: 'Single Column' },
              { id: 'two-column-left', label: 'Left Sidebar' },
              { id: 'two-column-right', label: 'Right Sidebar' },
              { id: 'executive-banner', label: 'Executive Banner' },
              { id: 'timeline', label: 'Timeline Path' },
              { id: 'gradient-hero', label: 'Gradient Banner' }
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => updateLayoutType(l.id as LayoutType)}
                className={`p-2 rounded-lg border text-center font-medium transition-all ${
                  config.layout.type === l.id ? 'border-gold bg-gold/10 font-bold text-navy dark:text-gold' : 'border-gray-200 dark:border-slate-700 text-navy dark:text-slate-300'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Header Style Controls */}
        <div className="space-y-3">
          <h4 className="font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-slate-800 pb-1 text-gold">Header Styling</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'modern-accent', label: 'Modern Accent' },
              { id: 'executive-banner', label: 'Executive Dark' },
              { id: 'centered-classic', label: 'Centered Classic' },
              { id: 'gradient-hero', label: 'Gradient Hero' },
              { id: 'tech-terminal', label: 'Tech Terminal' }
            ].map((h) => (
              <button
                key={h.id}
                onClick={() => updateHeaderStyle(h.id as HeaderStyleType)}
                className={`p-2 rounded-lg border text-center font-medium transition-all ${
                  config.headerConfig.style === h.id ? 'border-gold bg-gold/10 font-bold text-navy dark:text-gold' : 'border-gray-200 dark:border-slate-700 text-navy dark:text-slate-300'
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>

        {/* Page Margins & Spacing */}
        <div className="space-y-3">
          <h4 className="font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-slate-800 pb-1 text-gold">Page Margins & Density</h4>
          <div className="flex gap-2">
            {(['compact', 'normal', 'spacious'] as const).map((m) => (
              <button
                key={m}
                onClick={() => updatePageMargin(m)}
                className={`flex-1 p-2 rounded-lg border text-center font-medium capitalize transition-all ${
                  config.layout.pageMargin === m ? 'border-gold bg-gold/10 font-bold text-navy dark:text-gold' : 'border-gray-200 dark:border-slate-700 text-navy dark:text-slate-300'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Footer Close CTA */}
      <div className="p-4 bg-gray-50 dark:bg-slate-950 border-t border-outline-variant dark:border-slate-800">
        <button 
          onClick={onClose}
          className="w-full bg-navy dark:bg-gold text-white dark:text-navy font-bold py-2.5 rounded-lg uppercase tracking-wider hover:bg-gold hover:text-navy dark:hover:bg-[#8e6f3d] transition-colors"
        >
          Apply Customizations
        </button>
      </div>
    </div>
  );
};
