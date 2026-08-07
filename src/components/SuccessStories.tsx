import React from 'react';

export const SuccessStories: React.FC = () => {
  return (
    <section className="py-xl px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto font-sans">
      <div className="mb-xl border-b border-outline-variant pb-sm">
        <h2 className="font-label-caps text-label-caps uppercase text-navy font-semibold tracking-wider">Success Stories</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
        <div className="col-span-1 md:col-span-5 border border-outline-variant p-lg bg-white rounded shadow-xs">
          <p className="font-sans text-body-lg text-navy italic mb-lg leading-relaxed font-normal">
            "The interface forces you to focus on what matters. No templates to distract you, just pure information architecture. My interview rate doubled after applying this structural methodology."
          </p>
          <div className="flex items-center gap-md border-t border-outline-variant pt-md">
            <div className="w-12 h-12 bg-surface-container-low border border-outline-variant rounded overflow-hidden">
              <img 
                className="w-full h-full object-cover grayscale" 
                alt="Portrait of Elena R." 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeGNIuuIJ6BfrqiYzU4id7QJE8BJizjiyTDT7dVflsI97LzFo3SGcwHj0lLWrXOvcPG9wlqwPss95FVgq0XnzaN3o0GpXbGYXG_-ALYuTr8uSrh8TTUB85r2-0KKiG4glm4DyzzEOpumNjG4qqWLTNxhQ7mHDne0NeUcJc7c2zQUc8hMTI8M32KPY3b07q49_wrOVT3MY_U0Co-OVPbQV2F1yI9sFzAMz20zmZaGRoO0cp9Tldvg41"
              />
            </div>
            <div>
              <div className="font-label-caps text-label-caps text-navy uppercase font-semibold">Elena R.</div>
              <div className="font-caption text-caption text-navy font-medium">Senior Product Designer</div>
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-7 grid grid-rows-2 gap-gutter">
          <div className="border border-outline-variant p-md bg-white flex flex-col justify-between rounded shadow-xs">
            <p className="font-sans text-body-md text-navy mb-md leading-relaxed font-normal">
              "I needed to convey complex engineering projects clearly. CV PILOT's parsing engine suggested the exact technical verbs needed to bypass the ATS screens. Highly efficient tool."
            </p>
            <div className="flex justify-between items-end">
              <div>
                <div className="font-label-caps text-label-caps text-navy uppercase font-semibold">David K.</div>
                <div className="font-caption text-caption text-navy font-medium">Data Engineer</div>
              </div>
              <span className="material-symbols-outlined text-gold" data-icon="arrow_outward">
                arrow_outward
              </span>
            </div>
          </div>

          <div className="border border-outline-variant p-md bg-surface-container-low flex flex-col justify-between rounded shadow-xs">
            <p className="font-sans text-body-md text-navy mb-md leading-relaxed font-normal">
              "The low-fidelity aesthetic is a relief. It treats building a resume as a serious data-entry task rather than a graphic design project."
            </p>
            <div className="flex justify-between items-end">
              <div>
                <div className="font-label-caps text-label-caps text-navy uppercase font-semibold">Sarah J.</div>
                <div className="font-caption text-caption text-navy font-medium">Operations Manager</div>
              </div>
              <span className="material-symbols-outlined text-gold" data-icon="arrow_outward">
                arrow_outward
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
