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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      className="relative rounded-2xl p-5 sm:p-6 border border-white/[0.08] bg-[#121316] transition-all duration-300 overflow-hidden shadow-sm"
    >
      {/* Header Bar */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <HeartHandshake className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" strokeWidth={1.5} />

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-neutral-400">
                Support & Helplines
              </span>
              {isProminent && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/[0.04] border border-white/[0.08] text-neutral-300">
                  24/7 Verified
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              Need someone to talk to?
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl">
              {SUPPORT_DISCLAIMER}
            </p>
          </div>
        </div>

        {/* Action Controls (Toggle Expand & Dismiss) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 hover:text-white border border-white/[0.08] transition-colors cursor-pointer text-xs flex items-center gap-1"
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
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
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
                  className="rounded-xl p-4 sm:p-5 bg-[#18191c] border border-white/[0.06] hover:border-white/[0.12] transition-colors space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {res.name}
                        </h4>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          {res.agency}
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-white/[0.04] border border-white/[0.08] text-neutral-300 shrink-0">
                        {res.hours}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {res.description}
                    </p>

                    <div className="text-[11px] text-neutral-400 font-mono">
                      Languages: {res.languages}
                    </div>
                  </div>

                  {/* Dial & Copy Action Buttons */}
                  <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
                    {/* Primary Number Call */}
                    <a
                      href={res.telPrimaryUri}
                      className="px-3.5 py-1.5 rounded-lg bg-white text-neutral-950 text-xs font-medium hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call {res.phonePrimary}</span>
                    </a>

                    {/* Secondary Number Call if exists */}
                    {res.phoneSecondary && res.telSecondaryUri && (
                      <a
                        href={res.telSecondaryUri}
                        className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] text-xs font-medium transition-colors flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Call {res.phoneSecondary}</span>
                      </a>
                    )}

                    {/* Copy Primary Number */}
                    <button
                      onClick={() => handleCopy(res.phonePrimary)}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-neutral-400 hover:text-white border border-white/[0.08] text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
                      title="Copy phone number"
                    >
                      {copiedNumber === res.phonePrimary ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
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
