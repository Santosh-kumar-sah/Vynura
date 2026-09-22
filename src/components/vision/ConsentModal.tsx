import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, EyeOff, Camera, Cpu, Sparkles, X } from 'lucide-react';
import { Button } from '../common/Button';

interface ConsentModalProps {
  isOpen: boolean;
  onGrantAccess: () => void;
  onClose: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  onGrantAccess,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg rounded-2xl bg-[#121316] border border-white/[0.08] p-6 sm:p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7)] overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-5">
          <Camera className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" strokeWidth={1.5} />
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
              Camera Access · Privacy Assured
            </div>
            <h3 className="text-xl font-semibold text-white tracking-tight mt-0.5">
              On-device expression telemetry
            </h3>
          </div>
        </div>

        {/* Privacy Assurances */}
        <p className="text-xs text-neutral-400 leading-relaxed mb-6">
          Vynura requires momentary camera access to analyze facial landmarks and detect emotional state in real time. Processing is strictly local.
        </p>

        {/* Key Guarantees */}
        <div className="space-y-3 mb-8 bg-[#18191c] p-4 rounded-xl border border-white/[0.06]">
          <div className="flex items-start gap-3">
            <EyeOff className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-medium text-white">Zero Video or Image Uploads</div>
              <div className="text-[11px] text-neutral-400">
                Video frames are analyzed locally in ephemeral RAM and instantly discarded.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Cpu className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-medium text-white">100% On-Device Neural Compute</div>
              <div className="text-[11px] text-neutral-400">
                Tensor models run client-side on your device via WebAssembly/WebGL.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-medium text-white">Only State Persisted</div>
              <div className="text-[11px] text-neutral-400">
                Only the resulting mood classification and timestamp are saved in your telemetry logs.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            size="lg"
            variant="primary"
            className="w-full sm:flex-1"
            icon={<Sparkles className="w-4 h-4" />}
            onClick={onGrantAccess}
          >
            Grant Camera Access
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
