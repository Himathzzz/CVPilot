import React, { useEffect, useRef } from 'react';
import { useMembership } from '../../context/MembershipContext';

interface AdSenseBannerProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slotId,
  format = 'auto',
  responsive = true,
  className = '',
  style = {},
  label = 'Advertisement'
}) => {
  const { isProMember } = useMembership();
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-6215521360865271';
  const isDummyClient = !clientId || clientId.includes('XXXX');
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    // Only attempt to push ad if not Pro, valid client, slot exists, and hasn't pushed yet
    if (isProMember || isDummyClient || !slotId || pushedRef.current) {
      return;
    }

    try {
      if (typeof window !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        pushedRef.current = true;
      }
    } catch (err) {
      console.warn('AdSense push notice:', err);
    }
  }, [isProMember, isDummyClient, slotId]);

  // Pro members get an ad-free experience!
  if (isProMember) {
    return null;
  }

  // Preview placeholder during local development or before Publisher ID is set
  if (isDev || isDummyClient || !slotId) {
    return (
      <aside 
        aria-label="Advertisement placeholder"
        className={`my-6 mx-auto w-full max-w-4xl px-4 ${className}`}
      >
        <div className="w-full border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all duration-200 min-h-[100px]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {label}
            </span>
            {isDummyClient && (
              <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-2 py-0.5 rounded-full">
                Setup: Add AdSense Client ID in .env
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {slotId ? `Ad Unit Slot ID: ${slotId}` : 'Google AdSense Banner will display here in production.'}
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside 
      aria-label="Advertisement"
      className={`my-6 mx-auto w-full max-w-5xl px-4 flex flex-col items-center overflow-hidden ${className}`}
    >
      <span className="text-[9px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500 mb-1">
        {label}
      </span>
      <div className="w-full flex justify-center overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '90px', ...style }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </aside>
  );
};
