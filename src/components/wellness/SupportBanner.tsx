import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneCall,
  Copy,
  Check,
  X,
  HeartHandshake,
  Shield,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { INDIA_SUPPORT_RESOURCES, SUPPORT_DISCLAIMER } from '../../data/supportResources';

interface SupportBannerProps {
  isProminent?: boolean;
  initialDismissed?: boolean;
  onDismiss?: () => void;
}

export const SupportBanner: React.FC<SupportBannerProps> = ({
  isProminent = false,
  initialDismissed = false,
  onDismiss,
}) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(initialDismissed);
  const [isExpanded, setIsExpanded] = useState<boolean>(isProminent);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  if (isDismissed) return null;

  const handleCopy = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(number);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) onDismiss();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className={`relative rounded-3xl p-5 sm:p-6 border transition-all duration-500 overflow-hidden ${
        isProminent
          ? 'bg-gradient-to-br from-[#2D1B2D]/95 via-[#1E1938]/95 to-[#121029]/95 border-[#FF9EAA]/45 shadow-[0_12px_45px_rgba(255,158,170,0.16)]'
          : 'bg-[#1A1836]/90 border-[#B8B4D9]/25 shadow-sm'
      }`}
    >
      {/* Ambient Warm Rose / Lavender Light Pool */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#FF9EAA]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Bar */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-[#FF9EAA]/20 border border-[#FF9EAA]/40 text-[#FF9EAA] shrink-0 mt-0.5 shadow-inner">
            <HeartHandshake className="w-5 h-5 text-[#FF9EAA]" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF9EAA]">
                Support & Caring Space
              </span>
              {isProminent && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#FF9EAA]/15 border border-[#FF9EAA]/30 text-[#FF9EAA]">
                  24/7 Verified Helplines
                </span>
              )}
            </div>

            <h3 className="font-heading text-lg sm:text-xl font-bold text-[#F5F2ED]">
              Need someone gentle to talk to?
            </h3>
            <p className="text-xs text-[#B8B4D9] leading-relaxed max-w-2xl">
              {SUPPORT_DISCLAIMER}
            </p>
          </div>
        </div>

        {/* Action Controls (Toggle Expand & Dismiss) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-[#24214A]/80 hover:bg-[#2D2A5C] text-[#B8B4D9] hover:text-[#F5F2ED] border border-[#B8B4D9]/20 transition-all cursor-pointer text-xs flex items-center gap-1"
            title={isExpanded ? 'Collapse resources' : 'Expand resources'}
            aria-label="Toggle helpline resources"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={handleDismiss}
            className="p-2 rounded-xl bg-[#24214A]/80 hover:bg-[#2D2A5C] text-[#B8B4D9] hover:text-[#FF9EAA] border border-[#B8B4D9]/20 transition-all cursor-pointer"
            title="Dismiss support banner"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Verified Helplines Grid */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            className="mt-6 pt-5 border-t border-[#B8B4D9]/15 space-y-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {INDIA_SUPPORT_RESOURCES.map((res) => (
                <div
                  key={res.id}
                  className="rounded-2xl p-4 sm:p-5 bg-[#121029]/80 border border-[#B8B4D9]/20 hover:border-[#FF9EAA]/40 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-heading text-base font-bold text-[#F5F2ED]">
                          {res.name}
                        </h4>
                        <div className="text-[11px] text-[#B8B4D9]/80 font-mono">
                          {res.agency}
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#6FBFC4]/15 border border-[#6FBFC4]/30 text-[#6FBFC4] shrink-0">
                        {res.hours}
                      </span>
                    </div>

                    <p className="text-xs text-[#B8B4D9] leading-relaxed">
                      {res.description}
                    </p>

                    <div className="text-[11px] text-[#FFC978]/90 font-mono">
                      🌐 {res.languages}
                    </div>
                  </div>

                  {/* Dial & Copy Action Buttons */}
                  <div className="pt-2 border-t border-[#B8B4D9]/10 flex flex-wrap items-center gap-2">
                    {/* Primary Number Call */}
                    <a
                      href={res.telPrimaryUri}
                      className="px-3.5 py-2 rounded-xl bg-[#FF9EAA]/20 hover:bg-[#FF9EAA]/30 text-[#FF9EAA] border border-[#FF9EAA]/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call {res.phonePrimary}</span>
                    </a>

                    {/* Secondary Number Call if exists */}
                    {res.phoneSecondary && res.telSecondaryUri && (
                      <a
                        href={res.telSecondaryUri}
                        className="px-3.5 py-2 rounded-xl bg-[#24214A] hover:bg-[#2D2A5C] text-[#F5F2ED] border border-[#B8B4D9]/25 text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-[#B8B4D9]" />
                        <span>Call {res.phoneSecondary}</span>
                      </a>
                    )}

                    {/* Copy Primary Number */}
                    <button
                      onClick={() => handleCopy(res.phonePrimary)}
                      className="px-3 py-2 rounded-xl bg-[#1A1836] hover:bg-[#24214A] text-[#B8B4D9] hover:text-[#F5F2ED] border border-[#B8B4D9]/20 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
                      title="Copy phone number"
                    >
                      {copiedNumber === res.phonePrimary ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#78FFD6]" />
                          <span className="text-[#78FFD6]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Reassuring Footer Disclaimer */}
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-[#B8B4D9]/70">
              <Shield className="w-3.5 h-3.5 text-[#FFC978]" />
              <span>
                Free & confidential · Calls do not go through Vynura servers · Direct telecom routing
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
