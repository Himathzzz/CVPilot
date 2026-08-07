import React from 'react';

export const ProcessSection: React.FC = () => {
  return (
    <section className="py-xl px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto bg-white border-t border-outline-variant font-sans">
      <div className="mb-xl text-center">
        <h2 className="font-display text-h1 font-bold text-navy">The Process</h2>
        <p className="font-sans text-body-md text-navy mt-sm font-normal">Data-driven structuring in three precise steps.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Step 1 */}
        <div className="col-span-1 md:col-span-4 border border-outline-variant p-lg bg-surface-container-low flex flex-col gap-md group hover:border-gold transition-colors rounded shadow-xs">
          <div className="flex justify-between items-start border-b border-outline-variant pb-sm">
            <span className="font-label-caps text-label-caps uppercase text-navy font-medium">01. Input Data</span>
            <span className="material-symbols-outlined text-gold group-hover:scale-110 transition-transform" data-icon="data_object">
              data_object
            </span>
          </div>
          <div className="flex-grow">
            <h3 className="font-display text-h2 text-navy font-semibold mb-sm">Raw Information Gather</h3>
            <p className="font-sans text-body-md text-navy leading-relaxed font-normal">
              Input your raw professional history into our structured fields. The rigid grid format ensures zero data loss during transcription.
            </p>
          </div>
          <div className="h-32 border border-dashed border-gold mt-sm flex items-center justify-center bg-white rounded">
            <span className="font-caption text-caption text-navy font-medium">Data Entry Canvas</span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="col-span-1 md:col-span-4 border border-outline-variant p-lg bg-surface-container-low flex flex-col gap-md group hover:border-gold transition-colors rounded shadow-xs">
          <div className="flex justify-between items-start border-b border-outline-variant pb-sm">
            <span className="font-label-caps text-label-caps uppercase text-navy font-medium">02. AI Analysis</span>
            <span className="material-symbols-outlined text-gold group-hover:scale-110 transition-transform" data-icon="memory">
              memory
            </span>
          </div>
          <div className="flex-grow">
            <h3 className="font-display text-h2 text-navy font-semibold mb-sm">Semantic Optimization</h3>
            <p className="font-sans text-body-md text-navy leading-relaxed font-normal">
              Our engine parses your data, applying industry-specific action verbs and structural hierarchy to maximize ATS readability.
            </p>
          </div>
          <div className="flex flex-wrap gap-xs mt-sm">
            <span className="border border-outline-variant px-sm py-xs bg-white text-navy font-sans text-caption font-medium rounded">Spearheaded</span>
            <span className="border border-outline-variant px-sm py-xs bg-white text-navy font-sans text-caption font-medium rounded">Architected</span>
            <span className="border border-outline-variant px-sm py-xs bg-white text-navy font-sans text-caption font-medium rounded">Optimized</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="col-span-1 md:col-span-4 border border-outline-variant p-lg bg-surface-container-low flex flex-col gap-md group hover:border-gold transition-colors rounded shadow-xs">
          <div className="flex justify-between items-start border-b border-outline-variant pb-sm">
            <span className="font-label-caps text-label-caps uppercase text-navy font-medium">03. Export</span>
            <span className="material-symbols-outlined text-gold group-hover:scale-110 transition-transform" data-icon="file_download">
              file_download
            </span>
          </div>
          <div className="flex-grow">
            <h3 className="font-display text-h2 text-navy font-semibold mb-sm">Structural Output</h3>
            <p className="font-sans text-body-md text-navy leading-relaxed font-normal">
              Generate a clean, high-fidelity PDF adhering strictly to typographic hierarchy rules, ready for immediate deployment.
            </p>
          </div>
          <div className="h-32 border border-outline-variant mt-sm relative overflow-hidden bg-white rounded">
            <div className="absolute inset-x-4 top-4 border-b border-gold"></div>
            <div className="absolute inset-x-4 top-8 border-b border-gold w-1/2"></div>
            <div className="absolute inset-x-4 top-16 border-b border-outline-variant"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
