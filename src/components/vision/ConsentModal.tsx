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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0D24]/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#24214A] via-[#1A1836] to-[#14122C] border border-[#FFC978]/35 p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(10,8,28,0.95)] overflow-hidden"
      >
        {/* Top Rim Glow */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFC978] to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#B8B4D9] hover:text-[#F5F2ED] hover:bg-[#2D2A5C]/60 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Anime Badge */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#FFC978]/15 border border-[#FFC978]/40 flex items-center justify-center text-[#FFC978] shadow-glow-sm">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FFC978] font-bold">
                Private Camera Sanctuary
              </span>
              <span className="text-xs text-[#FFC978]/80 font-heading">手作り視覚</span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F2ED]">
              Mirror of the Celestial Sky
            </h3>
          </div>
        </div>

        {/* Privacy Assurances */}
        <p className="text-sm text-[#B8B4D9] leading-relaxed mb-6">
          Vynura requires momentary camera access to analyze your facial micro-landmarks and detect your emotional frequency in real time.
        </p>

        {/* Key Guarantees */}
        <div className="space-y-3 mb-8 bg-[#121029]/80 p-4 rounded-xl border border-[#B8B4D9]/15">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-[#6FBFC4]/15 text-[#6FBFC4] mt-0.5">
              <EyeOff className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#F5F2ED]">Zero Video or Image Uploads</div>
              <div className="text-[11px] text-[#B8B4D9]">
                Your video frames are analyzed locally in ephemeral RAM and instantly discarded.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-[#FFC978]/15 text-[#FFC978] mt-0.5">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#F5F2ED]">100% On-Device Neural Compute</div>
              <div className="text-[11px] text-[#B8B4D9]">
                face-api.js neural models run client-side on your device via WebAssembly/WebGL.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-[#FF9E7D]/15 text-[#FF9E7D] mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#F5F2ED]">Only Mood Label Persisted</div>
              <div className="text-[11px] text-[#B8B4D9]">
                Only the resulting mood classification and timestamp are saved in your personal constellation.
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
            Enter The Mirror
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
