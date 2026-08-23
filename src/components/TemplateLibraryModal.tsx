import React, { useState, useMemo } from 'react';
import { TEMPLATE_PACKS } from '../data/templatePacks';
import type { TemplateConfig } from '../types/templateEngine';
import { useMembership } from '../context/MembershipContext';

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplateConfig: (config: TemplateConfig) => void;
  selectedTemplateId?: string;
}

const CATEGORIES_LIST = [
  'All',
  'Modern',
  'Executive',
  'Creative',
  'Corporate',
  'ATS Friendly',
  'Developer',
  'Academic',
  'Medical',
  'Marketing',
  'Finance',
  'Legal',
  'Startup',
  'Minimal',
  'Luxury'
];

export const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplateConfig,
  selectedTemplateId
}) => {
  const { isProMember, openUpgradeModal } = useMembership();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'pro'>('all');
  const [columnFilter, setColumnFilter] = useState<'all' | 'one-column' | 'two-column'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [likedTemplateIds, setLikedTemplateIds] = useState<Record<string, boolean>>({});

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedTemplateIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTemplates = useMemo(() => {
    return TEMPLATE_PACKS.filter(tpl => {
      // Category filter
      if (selectedCategory !== 'All' && tpl.category !== selectedCategory) {
        return false;
      }
      // Free / Pro filter
      if (filterType === 'free' && tpl.isPremium) return false;
      if (filterType === 'pro' && !tpl.isPremium) return false;
      // Column filter
      if (columnFilter === 'one-column' && tpl.layout.type.includes('two-column')) return false;
      if (columnFilter === 'two-column' && !tpl.layout.type.includes('two-column')) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          tpl.name.toLowerCase().includes(q) ||
          tpl.description.toLowerCase().includes(q) ||
          tpl.category.toLowerCase().includes(q) ||
          tpl.industry.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, filterType, columnFilter, searchQuery]);

  if (!isOpen) return null;

  const handleSelect = (tpl: TemplateConfig) => {
    if (tpl.isPremium && !isProMember) {
      openUpgradeModal();
      return;
    }
    onSelectTemplateConfig(tpl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy/85 dark:bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-6xl w-full overflow-hidden border border-outline-variant dark:border-slate-800 flex flex-col h-[92vh] transition-colors duration-300">
        
        {/* Modal Header */}
        <div className="bg-navy dark:bg-slate-950 text-white p-4 sm:p-5 flex flex-wrap justify-between items-center gap-4 shrink-0 border-b border-gold/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-gold text-2xl">dashboard_customize</span>
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide font-display text-white">Template Engine Marketplace</h2>
              <span className="bg-gold text-navy text-[10px] font-extrabold px-2.5 py-0.5 rounded-full font-mono">
                {TEMPLATE_PACKS.length} TEMPLATES
              </span>
            </div>
            <p className="text-xs text-gray-300 dark:text-slate-400 mt-1">Component-driven, configuration-based templates supporting unlimited customization.</p>
          </div>

          <div className="flex items-center gap-3">
            {!isProMember && (
              <button 
                onClick={openUpgradeModal}
                className="bg-gold hover:bg-[#8e6f3d] text-navy font-black text-xs px-4 py-2 rounded-lg uppercase flex items-center gap-1.5 shadow-sm transition-colors border border-gold"
              >
                <span className="material-symbols-outlined text-sm">workspace_premium</span>
                Upgrade to Pro ($5/mo)
              </button>
            )}
            <button 
              onClick={onClose}
              className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-surface-container-low dark:bg-slate-900 border-b border-outline-variant dark:border-slate-800 flex flex-wrap justify-between items-center gap-3 shrink-0">
          
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-sm">search</span>
            <input 
              type="text"
              placeholder="Search templates by name, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input text-xs pl-9 py-2 bg-white dark:bg-slate-800 rounded-lg border-gray-300 dark:border-slate-700 text-navy dark:text-white focus:border-gold"
            />
          </div>

          {/* Tier Filters */}
          <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-outline-variant dark:border-slate-700 text-xs shadow-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 font-bold rounded-md transition-all ${filterType === 'all' ? 'bg-navy dark:bg-gold text-white dark:text-navy' : 'text-navy dark:text-slate-300'}`}
            >
              All ({TEMPLATE_PACKS.length})
            </button>
            <button
              onClick={() => setFilterType('free')}
              className={`px-3 py-1 font-bold rounded-md transition-all ${filterType === 'free' ? 'bg-navy dark:bg-gold text-white dark:text-navy' : 'text-navy dark:text-slate-300'}`}
            >
              Free ({TEMPLATE_PACKS.filter(t => !t.isPremium).length})
            </button>
            <button
              onClick={() => setFilterType('pro')}
              className={`px-3 py-1 font-bold rounded-md transition-all ${filterType === 'pro' ? 'bg-navy dark:bg-gold text-white dark:text-navy' : 'text-navy dark:text-slate-300'}`}
            >
              Pro $5/mo ({TEMPLATE_PACKS.filter(t => t.isPremium).length})
            </button>
          </div>

          {/* Layout Columns Filter */}
          <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-outline-variant dark:border-slate-700 text-xs shadow-xs">
            <button
              onClick={() => setColumnFilter('all')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-all ${columnFilter === 'all' ? 'bg-gold text-navy font-bold' : 'text-gray-600 dark:text-slate-400'}`}
            >
              Any Column
            </button>
            <button
              onClick={() => setColumnFilter('one-column')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-all ${columnFilter === 'one-column' ? 'bg-gold text-navy font-bold' : 'text-gray-600 dark:text-slate-400'}`}
            >
              1-Col
            </button>
            <button
              onClick={() => setColumnFilter('two-column')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-all ${columnFilter === 'two-column' ? 'bg-gold text-navy font-bold' : 'text-gray-600 dark:text-slate-400'}`}
            >
              2-Col Sidebar
            </button>
          </div>

          {/* Category Tabs */}
          <div className="w-full flex gap-1.5 overflow-x-auto pb-1 pt-1">
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === cat ? 'bg-gold text-navy font-bold shadow-xs' : 'bg-white dark:bg-slate-800 text-navy dark:text-slate-200 border border-outline-variant dark:border-slate-700 hover:border-gold'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 30+ Production Templates Grid */}
        <div className="p-6 flex-grow overflow-y-auto bg-gray-50 dark:bg-slate-950">
          {filteredTemplates.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl border border-dashed border-gray-300 my-auto">
              <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">search_off</span>
              <h3 className="text-base font-bold text-navy">No matching templates found</h3>
              <p className="text-xs text-gray-500 max-w-sm mt-1 mb-4">Try adjusting your search keywords, tier selection, column preference, or category filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setFilterType('all');
                  setColumnFilter('all');
                  setSearchQuery('');
                }}
                className="bg-navy text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-gold hover:text-navy transition-colors uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                const isLiked = likedTemplateIds[tpl.id];

                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelect(tpl)}
                    className={`group relative border rounded-xl overflow-hidden bg-white cursor-pointer transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 ${
                      isSelected ? 'ring-2 ring-gold border-gold shadow-md' : 'border-gray-200 hover:border-gold'
                    }`}
                  >
                    {/* Visual Blueprint Card */}
                    <div className="h-72 sm:h-80 bg-white p-4 relative flex flex-col justify-between border-b border-gray-100 overflow-hidden">
                      
                      {/* Miniature Structural Blueprint Preview */}
                      <div className="w-full h-full border border-gray-200 rounded p-2.5 bg-gray-50 flex flex-col justify-between shadow-xs">
                        {tpl.layout.type.includes('two-column') ? (
                          <div className="w-full h-full grid grid-cols-3 gap-2">
                            <div className="p-2 rounded flex flex-col justify-between text-white" style={{ backgroundColor: tpl.colorPalette.primary }}>
                              <div className="w-6 h-6 rounded-full bg-white/30 mx-auto"></div>
                              <div className="space-y-1">
                                <div className="w-full h-1 bg-white/70 rounded"></div>
                                <div className="w-3/4 h-1 bg-white/50 rounded"></div>
                              </div>
                            </div>
                            <div className="col-span-2 space-y-2 pt-1">
                              <div className="w-3/4 h-3 rounded" style={{ backgroundColor: tpl.colorPalette.primary }}></div>
                              <div className="w-full h-1.5 bg-gray-300 rounded"></div>
                              <div className="w-full h-1.5 bg-gray-200 rounded"></div>
                              <div className="w-2/3 h-1.5 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        ) : tpl.layout.type === 'executive-banner' || tpl.layout.type === 'gradient-hero' ? (
                          <div className="w-full h-full flex flex-col justify-between">
                            <div className="p-2.5 rounded text-white space-y-1" style={{ backgroundColor: tpl.colorPalette.primary }}>
                              <div className="w-2/3 h-3 bg-white rounded"></div>
                              <div className="w-1/3 h-1.5 bg-white/70 rounded"></div>
                            </div>
                            <div className="space-y-1.5 py-2">
                              <div className="w-full h-1.5 bg-gray-300 rounded"></div>
                              <div className="w-full h-1.5 bg-gray-200 rounded"></div>
                              <div className="w-3/4 h-1.5 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        ) : tpl.typography.fontFamily === 'mono' ? (
                          <div className="w-full h-full bg-gray-950 p-2.5 rounded flex flex-col justify-between text-white font-mono">
                            <div className="space-y-1">
                              <div className="w-3/4 h-3 rounded" style={{ backgroundColor: tpl.colorPalette.primary }}></div>
                              <div className="w-1/2 h-1.5 bg-gray-600 rounded"></div>
                            </div>
                            <div className="space-y-1.5">
                              <div className="w-full h-1.5 bg-gray-800 rounded"></div>
                              <div className="w-full h-1.5 bg-gray-800 rounded"></div>
                              <div className="w-2/3 h-1.5 bg-gray-800 rounded"></div>
                            </div>
                          </div>
                        ) : (
                          /* Default Standard / Minimal */
                          <div className="w-full h-full flex flex-col justify-between pt-1">
                            <div className="border-b pb-2 space-y-1.5" style={{ borderColor: tpl.colorPalette.primary }}>
                              <div className="w-2/3 h-3 rounded" style={{ backgroundColor: tpl.colorPalette.primary }}></div>
                              <div className="w-1/2 h-1.5 bg-gray-300 rounded"></div>
                            </div>
                            <div className="space-y-1.5">
                              <div className="w-full h-1.5 bg-gray-300 rounded"></div>
                              <div className="w-full h-1.5 bg-gray-200 rounded"></div>
                              <div className="w-3/4 h-1.5 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Tier & ATS Badges */}
                      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-1">
                        {tpl.isPremium ? (
                          <span className="bg-navy text-gold text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm flex items-center gap-1 border border-gold/40">
                            <span className="material-symbols-outlined text-xs">lock</span>
                            PRO $5/MO
                          </span>
                        ) : (
                          <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm">
                            FREE
                          </span>
                        )}
                        {tpl.isAtsFriendly && (
                          <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
                            ATS READY
                          </span>
                        )}
                      </div>

                      {/* Like Button */}
                      <button 
                        onClick={(e) => toggleLike(e, tpl.id)}
                        className="absolute top-4 left-4 z-10 p-1.5 bg-white/80 backdrop-blur-xs rounded-full hover:bg-white text-gray-600 hover:text-red-500 shadow-sm transition-colors"
                      >
                        <span className={`material-symbols-outlined text-base ${isLiked ? 'text-red-500 fill-1' : ''}`}>favorite</span>
                      </button>

                      {/* Hover Overlay CTA */}
                      <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                        <span className="bg-navy text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg border border-gold uppercase tracking-wider flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-gold">tune</span>
                          Customize & Apply
                        </span>
                      </div>
                    </div>

                    {/* Card Meta Info */}
                    <div className="p-4 bg-white flex justify-between items-center border-t border-gray-100">
                      <div>
                        <h4 className="text-sm font-extrabold text-navy font-sans truncate max-w-[220px]" title={tpl.name}>
                          {tpl.name}
                        </h4>
                        <span className="text-[11px] font-semibold text-gray-500 uppercase mt-0.5 block">
                          {tpl.category} • {tpl.layout.type.replace(/-/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-navy font-bold font-mono">★ {tpl.rating}</span>
                        <div className="w-4 h-4 rounded-full border-2 border-white shadow-xs" style={{ backgroundColor: tpl.colorPalette.primary }} title={`Primary Theme Color`}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-outline-variant flex justify-between items-center shrink-0">
          <div className="text-xs text-gray-500 font-medium">
            Showing <strong>{filteredTemplates.length}</strong> of <strong>{TEMPLATE_PACKS.length}</strong> JSON configured templates
          </div>
          <button 
            onClick={onClose}
            className="bg-surface-container-low border border-outline-variant text-navy hover:text-gold text-xs font-bold px-5 py-2 rounded-lg uppercase transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
